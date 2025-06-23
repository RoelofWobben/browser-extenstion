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
   * Adds a unique id to each extension record.
   * @param {Extension[]} extensions
   * @returns {Extension[]}
   */
  const giveIdToRecords = (extensions) => { 
    let id = 1;     
    for (const extension of extensions) { 
      extension.id = id;
      ++id; 
    }
    return extensions;  
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
        const records = giveIdToRecords(Array.isArray(json) ? json : []);
        saveRecords(records); 
        extensions = JSON.stringify(records);
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

    let id = 0;

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
      id++;
      card.setAttribute('data-id', id.toString()); 

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

  const enableEventhandlers = () => {
    // find removeButton 
    let removeButtons = document.querySelectorAll('.remove-button'); 
    // add Eventlisteners
    for (let i = 0; i < 11; i++) {
        removeButtons[i].addEventListener("click", (e) => {
           // search for data-id 
           // ???
        });
      }
    }

  // Fetch and display extensions
  const extensions = await getExtensions();
  displayExtensions(extensions);
  enableEventhandlers(); 

})();


















