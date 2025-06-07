//@ts-check

/**
 * Handles dark mode toggle functionality.
 * Saves the user's preference in localStorage and updates the toggle state.
 * 
 * Expects the following HTML structure:
 * <input type="checkbox" id="theme-toggle" />
 */

(function () {
  'use strict';

  /** @type {string|null} */
  let darkMode = localStorage.getItem('darkMode');

  /** @type {HTMLInputElement|null} */
  const darkModeToggle = document.querySelector('#theme-toggle');

  if (!darkModeToggle || !(darkModeToggle instanceof HTMLInputElement)) {
    console.log("the toggle cannot be found");
    return
  }

  if (darkMode === 'enabled') {
    enableDarkMode();
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', () => {
      darkMode = localStorage.getItem('darkMode');
      if (darkMode !== 'enabled') {
        enableDarkMode();
      } else {
        disableDarkMode();
      }
    });
  }

  /**
   * Enables dark mode and updates localStorage and toggle state.
   * @returns {void}
   */
  function enableDarkMode() {
    if (darkModeToggle) darkModeToggle.checked = true;
    localStorage.setItem('darkMode', 'enabled');
  }

  /**
   * Disables dark mode and updates localStorage and toggle state.
   * @returns {void}
   */
  function disableDarkMode() {
    if (darkModeToggle) darkModeToggle.checked = false;
    localStorage.removeItem('darkMode');
  }
})();
