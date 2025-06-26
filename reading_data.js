// @ts-check

/**
 * Reads extension data from localStorage or fetches from data.json if not present.
 * Then displays the extensions in the DOM using a template.
 * 
 * Expects the following HTML structure:
 * <template id="extension-template">...</template>
 * <div class="extensions"></div>
 */

(async function () {
  'use strict';

  /** @type {HTMLTemplateElement|null} */
  const template = /** @type {HTMLTemplateElement|null} */ (document.getElementById('extension-template'));

  /** @type {HTMLElement|null} */
  const extensionTable = document.querySelector('.extensions');

  if (!template || !(template instanceof HTMLTemplateElement)) {
    console.error("template is not good.");
    return;
  }

  /**
   * @typedef {Object} Extension
   * @property {number} id - Unique identifier for the extension
   * @property {string} logo - URL or path to the extension's logo image
   * @property {string} name - Name of the extension
   * @property {string} description - Description of the extension
   * @property {boolean} isActive - Whether the extension is active
   */

  /**
   * Saves extension records to localStorage.
   * @param {Extension[]} extensions
   * @returns {void}
   */
  const saveRecords = (extensions) => { 
    localStorage.setItem('extensionData', JSON.stringify(extensions)); 
  };

 
  /**
   * Gets the list of extensions from localStorage or fetches from data.json.
   * @returns {Promise<Extension[]>}
   */
  const getExtensions = async () => {
    let extensions = localStorage.getItem("extensionData");
    if (!extensions || extensions === "null") {
      // read from file
      try {
        const response = await fetch('data.json'); // Fetch JSON file
        const json = await response.json(); // Parse JSON
        let id = 1; 
        const extensions = json.map(extension => {
          const extensionWithId = {...extension, id: id}; // Add unique id to each extension
          id++;
          return extensionWithId;
        });
        saveRecords(extensions); // Save to localStorage
      } catch (error) {
        console.error('Error fetching JSON:', error);
        extensions = "";
      }
    } else {
      try {
        extensions = JSON.parse(extensions);
      } catch (e) {
        console.error('Error parsing extension data from localStorage:', e);
        extensions = "";
      }
    }
    return Array.isArray(extensions) ? extensions : [];
  };

  /**
   * Displays the list of extensions in the DOM.
   * @param {Extension[]} data - Array of extension objects to display
   * @returns {void}
   */
  const displayExtensions = (data) => {
    if (!data) {
      console.error("No data to display or data is not an array.");
      return;
    }

    for (const extension of data) {
      // Clone the new row and insert it into the table
      const clone = template.content.cloneNode(true);

      if (!(clone instanceof DocumentFragment)) {
        console.error("Clone is not a DocumentFragment.");
        return;
      }

      const card = clone.querySelector('.extension'); 
      if (!card) {
        console.error("Card element not found in the template.");
        return;
      }
      
      card.setAttribute('data-id', extension.id.toString()); 

      /** @type {HTMLImageElement|null} */
      let image = clone.querySelector("img");

      if (!image) {
        console.error("Image element not found in the template.");
        return;
      }
      image.src = extension.logo;

      /** @type {HTMLHeadingElement|null} */
      let h2 = clone.querySelector("h2");

      if (!h2) {
        console.error("Heading element not found in the template.");
        return;
      }
      h2.textContent = extension.name;

      /** @type {HTMLParagraphElement|null} */
      let p = clone.querySelector("p");

      if (!p) {
        console.error("Paragraph element not found in the template.");
        return;
      }
      p.textContent = extension.description;

      /** @type {HTMLInputElement|null} */
      let active = clone.querySelector("input[type='checkbox'][role='switch']");

      if (!active || !(active instanceof HTMLInputElement)) {
        console.error("Checkbox element not found in the template.");
        return;
      }
      active.checked = extension.isActive;

      if (!extensionTable) {
        console.error("Extension table element not found in the document.");
        return;
      }

      extensionTable.appendChild(clone);
    }
  };

  const enableEventhandlersRemoveButtons = () => {
    // find removeButton 
    let removeButtons = document.querySelectorAll('.remove-button'); 
    
    
    // add Eventlisteners
    
    removeButtons.forEach(element => {   
      element.addEventListener("click", async (e) => {
         
         const button = e.target;
         if (!button || !(button instanceof Element)) {
           console.error("Button is null or not an Element.");
           return;
         }
         const cardElement = button.closest('.extension');
         if (!cardElement) {
           console.error("Could not find closest .extension element.");
           return;
         }
         const card_id = cardElement.getAttribute('data-id');
         if (!card_id) {
           console.error("data-id attribute not found on .extension element.");
           return;
         }

         // read the data from localStorage
          let extensions = localStorage.getItem("extensionData");

          if (!extensions || extensions === "null") {
            console.error("No extension data found in localStorage.");
            return;
          }

          //filter out the extension with the given id
          const extensions_array = JSON.parse(extensions);
          if (Array.isArray(extensions_array)) {
            
            const filteredExtensions = extensions_array.filter(extension => extension.id !== parseInt(card_id));
            // save the new data to localStorage
            saveRecords(filteredExtensions);
            // remove the card from the DOM
            document.querySelector(`.extension[data-id='${card_id}']`)?.remove();
          } else {
            console.error("Parsed extensions is not an array.");
          }
          
          const extensions_new = await getExtensions();
          displayExtensions(extensions_new)
      
        })
    });

  };

  const enableEventhandlersSwitch = () => {
    // find all switches
    let switches = document.querySelectorAll('.extension input[type="checkbox"][role="switch"]');

    console.log("Switches:", switches);

    // add Eventlisteners
    switches.forEach(element => {
      element.addEventListener("change", async (e) => {
        const checkbox = e.target;
        if (!checkbox || !(checkbox instanceof HTMLInputElement)) {
          console.error("Checkbox is null or not an HTMLInputElement.");
          return;
        }
        const cardElement = checkbox.closest('.extension');
        if (!cardElement) {
          console.error("Could not find closest .extension element.");
          return;
        }
        const card_id = cardElement.getAttribute('data-id');
        if (!card_id) {
          console.error("data-id attribute not found on .extension element.");
          return;
        }

        // read the data from localStorage
        let extensions = localStorage.getItem("extensionData");
        if (!extensions || extensions === "null") {
          console.error("No extension data found in localStorage.");
          return;
        }

        // parse the data and update the isActive property
        const extensions_array = JSON.parse(extensions);
        if (Array.isArray(extensions_array)) {
          const extensionToUpdate = extensions_array.find(extension => extension.id === parseInt(card_id));
          if (extensionToUpdate) {
            extensionToUpdate.isActive = checkbox.checked; // Update isActive property
            saveRecords(extensions_array); // Save updated records
          } else {
            console.error(`Extension with id ${card_id} not found.`);
          }
        } else {
          console.error("Parsed extensions is not an array.");
        }
      });
    });
  };

  // Fetch and display extensions
  const extensions = await getExtensions();
  displayExtensions(extensions);
  enableEventhandlersRemoveButtons();
  enableEventhandlersSwitch(); 

})();


















