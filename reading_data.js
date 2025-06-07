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
   * @property {string} logo - URL or path to the extension's logo image
   * @property {string} name - Name of the extension
   * @property {string} description - Description of the extension
   * @property {boolean} isActive - Whether the extension is active
   */

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
        extensions = await response.json(); // Parse JSON
        localStorage.setItem("extensionData", JSON.stringify(extensions));
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
  }

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
      let active = clone.querySelector("[role='switch']");

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
  }

  const extensions = await getExtensions();
  displayExtensions(extensions);

})();


















