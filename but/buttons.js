/* =========================================================
   ⛏️ MINERO DEL ABISMO
   INTERFAZ / EFECTOS / MODALES
   ========================================================= */

(() => {

  "use strict";


  /* =======================================================
     ESPERAR A QUE EXISTAN LOS ELEMENTOS
     ======================================================= */

  function initInterface() {

    const game = document.getElementById("game");

    const hud = document.getElementById("hud");

    const controls = document.getElementById("controls");

    const bottomTabs = document.getElementById("bottom-tabs");

    const inventory = document.getElementById("panel-inventory");

    const shelter = document.getElementById("panel-shelter");

    const shop = document.getElementById("panel-shop");

    const crafting = document.getElementById("panel-crafting");

    if (!game) {
      return;
    }


    /* =====================================================
       EVITAR DUPLICADOS
       ===================================================== */

    if (document.getElementById("game-modal")) {
      return;
    }


    /* =====================================================
       CREAR MINI CONTROLES
       ===================================================== */

    const miniControls = document.createElement("div");

    miniControls.id = "mini-controls";

    game.insertBefore(
      miniControls,
      document.getElementById("map-container")
    );


    if (controls) {

      miniControls.appendChild(controls);

      /*
         Quitamos hidden porque ahora los controles
         viven permanentemente en la parte superior.
      */

      controls.classList.remove("hidden");

    }


    /* =====================================================
       CREAR BOTONES RÁPIDOS
       ===================================================== */

    const quickActions = document.createElement("div");

    quickActions.id = "quick-actions";


    /*
       MOCHILA
    */

    const backpackButton = document.createElement("button");

    backpackButton.className = "quick-action-btn";

    backpackButton.type = "button";

    backpackButton.textContent = "🎒";

    backpackButton.title = "Abrir mochila";

    backpackButton.setAttribute(
      "aria-label",
      "Abrir mochila"
    );


    /*
       TIENDA
    */

    const shopButton = document.createElement("button");

    shopButton.className = "quick-action-btn";

    shopButton.type = "button";

    shopButton.textContent = "🪙";

    shopButton.title = "Abrir tienda";

    shopButton.setAttribute(
      "aria-label",
      "Abrir tienda"
    );


    /*
       REFUGIO
    */

    const shelterButton = document.createElement("button");

    shelterButton.className = "quick-action-btn";

    shelterButton.type = "button";

    shelterButton.textContent = "🏠";

    shelterButton.title = "Abrir refugio";

    shelterButton.setAttribute(
      "aria-label",
      "Abrir refugio"
    );


    quickActions.appendChild(backpackButton);

    quickActions.appendChild(shopButton);

    quickActions.appendChild(shelterButton);

    document.body.appendChild(quickActions);


    /* =====================================================
       CREAR MODAL
       ===================================================== */

    const modal = document.createElement("div");

    modal.id = "game-modal";

    modal.classList.add("hidden");

    modal.setAttribute(
      "aria-hidden",
      "true"
    );


    /* =====================================================
       VENTANA
       ===================================================== */

    const modalWindow = document.createElement("div");

    modalWindow.id = "game-modal-window";

    modalWindow.setAttribute(
      "role",
      "dialog"
    );

    modalWindow.setAttribute(
      "aria-modal",
      "true"
    );


    /* =====================================================
       CABECERA
       ===================================================== */

    const modalHeader = document.createElement("div");

    modalHeader.id = "game-modal-header";


    const modalTitle = document.createElement("h2");

    modalTitle.id = "game-modal-title";

    modalTitle.textContent = "🎒 Mochila";


    const closeButton = document.createElement("button");

    closeButton.id = "game-modal-close";

    closeButton.type = "button";

    closeButton.textContent = "✕";

    closeButton.title = "Cerrar";

    closeButton.setAttribute(
      "aria-label",
      "Cerrar ventana"
    );


    modalHeader.appendChild(modalTitle);

    modalHeader.appendChild(closeButton);


    /* =====================================================
       CONTENIDO
       ===================================================== */

    const modalContent = document.createElement("div");

    modalContent.id = "game-modal-content";


    /*
       Guardamos el padre original.

       Esto permite restaurar los paneles si fuera necesario.
    */

    const originalParent = game;


    /* =====================================================
       MOVER PANELES AL MODAL
       ===================================================== */

    if (inventory) {
      modalContent.appendChild(inventory);
    }

    if (shelter) {
      modalContent.appendChild(shelter);
    }

    if (shop) {
      modalContent.appendChild(shop);
    }

    if (crafting) {
      modalContent.appendChild(crafting);
    }


    /* =====================================================
       MOVER TABS
       ===================================================== */

    if (bottomTabs) {

      modalWindow.appendChild(modalHeader);

      modalWindow.appendChild(modalContent);

      modalWindow.appendChild(bottomTabs);

    } else {

      modalWindow.appendChild(modalHeader);

      modalWindow.appendChild(modalContent);

    }


    modal.appendChild(modalWindow);

    document.body.appendChild(modal);


    /* =====================================================
       ESTADO DEL MODAL
       ===================================================== */

    let modalOpen = false;


    /* =====================================================
       NOMBRE DE PESTAÑA
       ===================================================== */

    function getPanelName(panel) {

      if (panel === inventory) {
        return "🎒 Mochila";
      }

      if (panel === shelter) {
        return "🏠 Refugio";
      }

      if (panel === shop) {
        return "🪙 Tienda";
      }

      if (panel === crafting) {
        return "🔨 Fabricar";
      }

      return "⛏️ Menú";

    }


    /* =====================================================
       MOSTRAR PANEL
       ===================================================== */

    function showPanel(panel) {

      if (!panel) {
        return;
      }


      /*
         Ocultar todos
      */

      [
        inventory,
        shelter,
        shop,
        crafting
      ].forEach(item => {

        if (!item) {
          return;
        }

        item.classList.add("hidden");

      });


      /*
         Mostrar seleccionado
      */

      panel.classList.remove("hidden");


      /*
         Cambiar título
      */

      modalTitle.textContent =
        getPanelName(panel);


      /*
         Activar botón correspondiente
      */

      if (bottomTabs) {

        const tabs =
          bottomTabs.querySelectorAll(".tab-btn");

        tabs.forEach(tab => {

          const tabName =
            tab.dataset.tab;

          let active = false;


          if (
            tabName === "inventory" &&
            panel === inventory
          ) {
            active = true;
          }


          if (
            tabName === "shelter" &&
            panel === shelter
          ) {
            active = true;
          }


          if (
            tabName === "shop" &&
            panel === shop
          ) {
            active = true;
          }

          if (
            tabName === "crafting" &&
            panel === crafting
          ) {
            active = true;
          }


          tab.classList.toggle(
            "active",
            active
          );

        });

      }

    }


    /* =====================================================
       ABRIR MODAL
       ===================================================== */

    function openModal(panel) {

      if (!panel) {
        return;
      }


      showPanel(panel);


      modal.classList.remove("hidden");

      modal.classList.remove("closing");


      modal.setAttribute(
        "aria-hidden",
        "false"
      );


      modalOpen = true;


      /*
         Evitar scroll de la página
      */

      document.body.style.overflow =
        "hidden";


      /*
         Actualizar contenido si existen
         las funciones originales del juego.
      */

      try {

        if (
          panel === inventory &&
          typeof renderInventory === "function"
        ) {
          renderInventory();
        }


        if (
          panel === shop &&
          typeof renderShop === "function"
        ) {
          renderShop();
        }

        if (
          panel === crafting &&
          typeof renderCrafting === "function"
        ) {
          renderCrafting();
        }


        if (
          typeof updateHUD === "function"
        ) {
          updateHUD();
        }

      } catch (error) {

        console.warn(
          "No se pudo actualizar el panel:",
          error
        );

      }

    }


    /* =====================================================
       CERRAR MODAL
       ===================================================== */

    function closeModal() {

      if (!modalOpen) {
        return;
      }


      modal.classList.add("closing");


      setTimeout(() => {

        modal.classList.add("hidden");

        modal.classList.remove("closing");


        modal.setAttribute(
          "aria-hidden",
          "true"
        );


        modalOpen = false;


        document.body.style.overflow =
          "hidden";

      }, 160);

    }

    /* =====================================================
       BOTÓN MOCHILA
       ===================================================== */

    backpackButton.addEventListener(
      "click",
      () => {

        openModal(inventory);

      }
    );


    /* =====================================================
       BOTÓN TIENDA
       ===================================================== */

    shopButton.addEventListener(
      "click",
      () => {

        openModal(shop);

      }
    );


    /* =====================================================
       BOTÓN REFUGIO
       ===================================================== */

    shelterButton.addEventListener(
      "click",
      () => {

        openModal(shelter);

      }
    );


    /* =====================================================
       BOTÓN X
       ===================================================== */

    closeButton.addEventListener(
      "click",
      closeModal
    );


    /* =====================================================
       CLIC FUERA DE LA VENTANA
       ===================================================== */

    modal.addEventListener(
      "click",
      event => {

        if (
          event.target === modal
        ) {

          closeModal();

        }

      }
    );


    /* =====================================================
       TABS
       ===================================================== */

    if (bottomTabs) {

      const tabs =
        bottomTabs.querySelectorAll(
          ".tab-btn"
        );


      tabs.forEach(tab => {

        tab.addEventListener(
          "click",
          event => {

            event.preventDefault();

            const name =
              tab.dataset.tab;


            if (
              name === "inventory"
            ) {

              openModal(inventory);

            }

            else if (
              name === "shelter"
            ) {

              openModal(shelter);

            }

            else if (
              name === "shop"
            ) {

              openModal(shop);

            }

            else if (
              name === "crafting"
            ) {

              openModal(crafting);

            }

          }
        );

      });

    }


    /* =====================================================
       TECLA ESC
       ===================================================== */

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape" ||
          event.key === "Esc"
        ) {

          /*
             Primero cerrar tesoro
          */

          const treasure =
            document.getElementById(
              "treasure-popup"
            );


          if (
            treasure &&
            !treasure.classList.contains(
              "hidden"
            )
          ) {

            const closeTreasure =
              document.getElementById(
                "treasure-close"
              );


            if (closeTreasure) {

              closeTreasure.click();

            }

            return;

          }


          /*
             Después cerrar menú
          */

          if (modalOpen) {

            closeModal();

          }

        }

      }
    );


    /* =====================================================
       ESCUCHAR CAMBIOS DE INVENTARIO
       ===================================================== */

    /*
       Si el juego llama renderInventory(),
       el panel ya está dentro del modal y
       seguirá funcionando normalmente.
    */


    /* =====================================================
       EFECTO DE BOTONES
       ===================================================== */

    document.addEventListener(
      "click",
      event => {

        const button =
          event.target.closest(
            "button"
          );


        if (!button) {
          return;
        }


        button.classList.add(
          "button-pressed"
        );


        setTimeout(() => {

          button.classList.remove(
            "button-pressed"
          );

        }, 120);

      }
    );


    /* =====================================================
       EXPONER CONTROL DEL MODAL
       ===================================================== */

    window.mineroUI = {

      openInventory: () => {
        openModal(inventory);
      },

      openShop: () => {
        openModal(shop);
      },

      openCrafting: () => {
        openModal(crafting);
      },

      openShelter: () => {
        openModal(shelter);
      },

      close: closeModal,

      isOpen: () => modalOpen

    };

  }


  /* =======================================================
     INICIAR CUANDO EL DOM ESTÉ LISTO
     ======================================================= */

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initInterface
    );

  } else {

    initInterface();

  }

})();