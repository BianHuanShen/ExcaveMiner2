/* ============================================================
   AUDIO SFX — EL MINERO DEL ABISMO
   Game Audio centralizado con Web Audio API.
   - Sin archivos externos: no hay descargas ni latencia de assets.
   - "Precalentamiento" del AudioContext tras el primer gesto.
   - Pool lógico de voces + cooldowns para evitar saturación.
   ============================================================ */

(() => {
  'use strict';

  let audioContext = null;
  let masterGain = null;
  let unlocked = false;
  let activeVoices = 0;

  const SFX_VOLUME = 0.18;
  const MAX_CONCURRENT = 10;
  const lastPlayed = Object.create(null);

  /* Cooldowns en ms: protegen sonidos que pueden dispararse muy rápido. */
  const COOLDOWN = {
    mine: 65,
    blockBreak: 100,
    rockFall: 180,
    mineAlert: 250,
    mineExplosion: 300,
    critical: 100,
    damage: 120,
    death: 600,
    potion: 180,
    levelUp: 500,
    inventoryOpen: 120,
    buy: 120,
    shelter: 400,
    itemFound: 100,
    uiClick: 35,
    equip: 100,
    unequip: 100,
    sell: 100,
    craft: 150
  };

  function getAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;

      audioContext = new AudioCtx();
      masterGain = audioContext.createGain();
      masterGain.gain.value = SFX_VOLUME;
      masterGain.connect(audioContext.destination);
    }

    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }

    unlocked = true;
    return audioContext;
  }

  /*
   * Web Audio no usa currentTime como HTMLAudioElement.
   * Para sonidos sintetizados, este cooldown + scheduling inmediato
   * cumple el mismo objetivo: reinicio rápido sin crear una cola infinita.
   */
  function allowed(name) {
    const now = performance.now();
    const wait = COOLDOWN[name] || 0;
    if (now - (lastPlayed[name] || 0) < wait) return false;
    lastPlayed[name] = now;
    return true;
  }

  function unlockAudio() {
    const ctx = getAudioContext();
    if (!ctx) return;

    /* Warm-up silencioso: deja listo el grafo de audio. */
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.00001, ctx.currentTime);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.01);
  }

  function scheduleVoice(duration, setup) {
    const ctx = getAudioContext();
    if (!ctx || activeVoices >= MAX_CONCURRENT) return;

    activeVoices++;
    const now = ctx.currentTime;
    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(0.00001, now);
    voiceGain.connect(masterGain);

    setup(ctx, now, voiceGain);

    window.setTimeout(() => {
      activeVoices = Math.max(0, activeVoices - 1);
    }, Math.max(50, duration * 1000 + 100));
  }

  function tone({
    frequency,
    duration = 0.08,
    type = 'sine',
    volume = 0.25,
    attack = 0.005,
    release = 0.06,
    detune = 0
  }) {
    scheduleVoice(duration + release, (ctx, now, out) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, now);
      osc.detune.setValueAtTime(detune, now);

      out.gain.setValueAtTime(0.00001, now);
      out.gain.linearRampToValueAtTime(volume, now + attack);
      out.gain.exponentialRampToValueAtTime(
        0.00001,
        now + Math.max(attack + 0.01, duration + release)
      );

      osc.connect(out);
      osc.start(now);
      osc.stop(now + duration + release + 0.02);
    });
  }

  function sweep({
    from,
    to,
    duration = 0.12,
    type = 'sine',
    volume = 0.2,
    attack = 0.004,
    release = 0.06
  }) {
    scheduleVoice(duration + release, (ctx, now, out) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(Math.max(20, from), now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), now + duration);

      out.gain.setValueAtTime(0.00001, now);
      out.gain.linearRampToValueAtTime(volume, now + attack);
      out.gain.exponentialRampToValueAtTime(0.00001, now + duration + release);

      osc.connect(out);
      osc.start(now);
      osc.stop(now + duration + release + 0.02);
    });
  }

  function noise({
    duration = 0.08,
    volume = 0.12,
    filterFrequency = 1800,
    highpass = 0
  }) {
    scheduleVoice(duration, (ctx, now, out) => {
      const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const source = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      filter.type = highpass > 0 ? 'highpass' : 'lowpass';
      filter.frequency.setValueAtTime(
        highpass > 0 ? highpass : filterFrequency,
        now
      );

      out.gain.setValueAtTime(volume, now);
      out.gain.exponentialRampToValueAtTime(0.00001, now + duration);

      source.buffer = buffer;
      source.connect(filter);
      filter.connect(out);
      source.start(now);
      source.stop(now + duration + 0.01);
    });
  }

  const SFX = {
    /* ---------------- MINERÍA / ENTORNO ---------------- */

    mine() {
      if (!allowed('mine')) return;
      tone({ frequency: 105, duration: 0.045, type: 'triangle', volume: 0.20, release: 0.025 });
      noise({ duration: 0.055, volume: 0.085, filterFrequency: 2600 });
    },

    blockBreak() {
      if (!allowed('blockBreak')) return;
      noise({ duration: 0.16, volume: 0.17, filterFrequency: 1700 });
      tone({ frequency: 82, duration: 0.10, type: 'triangle', volume: 0.16, release: 0.08 });
      window.setTimeout(() => tone({
        frequency: 55, duration: 0.11, type: 'sine', volume: 0.10, release: 0.08
      }), 35);
    },

    rockFall() {
      if (!allowed('rockFall')) return;
      sweep({ from: 120, to: 52, duration: 0.18, type: 'triangle', volume: 0.18, release: 0.10 });
      noise({ duration: 0.20, volume: 0.16, filterFrequency: 1200 });
    },

    mineAlert() {
      if (!allowed('mineAlert')) return;
      tone({ frequency: 440, duration: 0.07, type: 'square', volume: 0.13, release: 0.04 });
      window.setTimeout(() => tone({
        frequency: 660, duration: 0.07, type: 'square', volume: 0.13, release: 0.04
      }), 90);
      window.setTimeout(() => tone({
        frequency: 880, duration: 0.10, type: 'square', volume: 0.15, release: 0.05
      }), 180);
    },

    mineExplosion() {
      if (!allowed('mineExplosion')) return;
      noise({ duration: 0.32, volume: 0.32, filterFrequency: 900 });
      sweep({ from: 95, to: 28, duration: 0.28, type: 'sine', volume: 0.26, release: 0.12 });
      tone({ frequency: 45, duration: 0.24, type: 'triangle', volume: 0.20, release: 0.15 });
    },

    /* ---------------- COMBATE / ESTADO ---------------- */

    critical() {
      if (!allowed('critical')) return;
      tone({ frequency: 145, duration: 0.08, type: 'sawtooth', volume: 0.17, release: 0.04 });
      sweep({ from: 220, to: 95, duration: 0.14, type: 'square', volume: 0.20, release: 0.08 });
      noise({ duration: 0.08, volume: 0.08, filterFrequency: 3000 });
    },

    damage() {
      if (!allowed('damage')) return;
      noise({ duration: 0.09, volume: 0.12, filterFrequency: 1100, highpass: 180 });
      sweep({ from: 180, to: 90, duration: 0.10, type: 'triangle', volume: 0.12, release: 0.06 });
    },

    death() {
      if (!allowed('death')) return;
      sweep({ from: 330, to: 70, duration: 0.65, type: 'triangle', volume: 0.20, release: 0.25 });
      window.setTimeout(() => tone({
        frequency: 48, duration: 0.32, type: 'sine', volume: 0.13, release: 0.20
      }), 280);
    },

    potion() {
      if (!allowed('potion')) return;
      tone({ frequency: 330, duration: 0.08, type: 'sine', volume: 0.12, release: 0.05 });
      window.setTimeout(() => tone({
        frequency: 494, duration: 0.10, type: 'sine', volume: 0.14, release: 0.07
      }), 70);
      window.setTimeout(() => tone({
        frequency: 659, duration: 0.14, type: 'triangle', volume: 0.16, release: 0.10
      }), 145);
    },

    levelUp() {
      if (!allowed('levelUp')) return;
      tone({ frequency: 523.25, duration: 0.10, type: 'triangle', volume: 0.15, release: 0.06 });
      window.setTimeout(() => tone({
        frequency: 659.25, duration: 0.10, type: 'triangle', volume: 0.16, release: 0.06
      }), 100);
      window.setTimeout(() => tone({
        frequency: 783.99, duration: 0.12, type: 'triangle', volume: 0.17, release: 0.08
      }), 200);
      window.setTimeout(() => tone({
        frequency: 1046.5, duration: 0.22, type: 'sine', volume: 0.18, release: 0.14
      }), 310);
    },

    /* ---------------- INTERFAZ / ECONOMÍA / REFUGIO ---------------- */

    inventoryOpen() {
      if (!allowed('inventoryOpen')) return;
      sweep({ from: 260, to: 420, duration: 0.11, type: 'sine', volume: 0.11, release: 0.08 });
      noise({ duration: 0.055, volume: 0.035, filterFrequency: 3200 });
    },

    buy() {
      if (!allowed('buy')) return;
      tone({ frequency: 740, duration: 0.06, type: 'square', volume: 0.12, release: 0.04 });
      window.setTimeout(() => tone({
        frequency: 988, duration: 0.08, type: 'square', volume: 0.11, release: 0.05
      }), 60);
    },

    shelter() {
      if (!allowed('shelter')) return;
      sweep({ from: 180, to: 300, duration: 0.18, type: 'sine', volume: 0.11, release: 0.12 });
      noise({ duration: 0.12, volume: 0.045, filterFrequency: 1500 });
      window.setTimeout(() => tone({
        frequency: 392, duration: 0.16, type: 'triangle', volume: 0.10, release: 0.10
      }), 150);
    },

    /* ---------------- EXISTENTES ---------------- */

    uiClick() {
      if (!allowed('uiClick')) return;
      tone({ frequency: 520, duration: 0.035, type: 'sine', volume: 0.16, attack: 0.002, release: 0.025 });
    },

    itemFound() {
      if (!allowed('itemFound')) return;
      tone({ frequency: 523.25, duration: 0.08, volume: 0.20, release: 0.05 });
      window.setTimeout(() => tone({
        frequency: 659.25, duration: 0.09, volume: 0.19, release: 0.06
      }), 55);
      window.setTimeout(() => tone({
        frequency: 783.99, duration: 0.16, type: 'triangle', volume: 0.22, release: 0.10
      }), 115);
    },

    equip() {
      if (!allowed('equip')) return;
      tone({ frequency: 210, duration: 0.055, type: 'triangle', volume: 0.20, release: 0.05 });
      window.setTimeout(() => tone({
        frequency: 330, duration: 0.08, type: 'triangle', volume: 0.17, release: 0.06
      }), 35);
      noise({ duration: 0.045, volume: 0.045, filterFrequency: 3200 });
    },

    unequip() {
      if (!allowed('unequip')) return;
      tone({ frequency: 330, duration: 0.06, type: 'triangle', volume: 0.15, release: 0.05 });
      window.setTimeout(() => tone({
        frequency: 220, duration: 0.08, type: 'triangle', volume: 0.13, release: 0.07
      }), 45);
    },

    sell() {
      if (!allowed('sell')) return;
      tone({ frequency: 880, duration: 0.055, type: 'square', volume: 0.13, release: 0.04 });
      window.setTimeout(() => tone({
        frequency: 1174.66, duration: 0.09, type: 'square', volume: 0.12, release: 0.06
      }), 55);
      window.setTimeout(() => tone({
        frequency: 1567.98, duration: 0.12, type: 'triangle', volume: 0.11, release: 0.08
      }), 115);
    },

    craft() {
      if (!allowed('craft')) return;
      tone({ frequency: 120, duration: 0.09, type: 'triangle', volume: 0.22, release: 0.07 });
      noise({ duration: 0.07, volume: 0.08, filterFrequency: 4200 });
      window.setTimeout(() => tone({
        frequency: 740, duration: 0.10, type: 'triangle', volume: 0.15, release: 0.08
      }), 90);
      window.setTimeout(() => tone({
        frequency: 1110, duration: 0.13, type: 'sine', volume: 0.12, release: 0.09
      }), 145);
    }
  };

  window.playSfx = function(name) {
    if (!SFX[name]) return false;
    SFX[name]();
    return true;
  };

  window.setSfxVolume = function(value) {
    const ctx = getAudioContext();
    if (!ctx || !masterGain) return;
    const volume = Math.max(0, Math.min(1, Number(value)));
    masterGain.gain.setTargetAtTime(volume, ctx.currentTime, 0.01);
  };

  window.gameSfx = SFX;

  window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
  window.addEventListener('keydown', unlockAudio, { once: true });

  /* Exposición opcional para diagnóstico/ajustes futuros. */
  window.audioSfxState = () => ({
    supported: Boolean(window.AudioContext || window.webkitAudioContext),
    unlocked,
    activeVoices,
    maxConcurrent: MAX_CONCURRENT
  });
})();
