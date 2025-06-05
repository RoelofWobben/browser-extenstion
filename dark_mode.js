let darkMode = localStorage.getItem('darkMode'); 

const darkModeToggle = document.querySelector('#theme-toggle');

console.log(darkModeToggle);
console.log(darkMode);

const enableDarkMode = () => {
  darkModeToggle.checked = true;
  localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
   darkModeToggle.checked = false;
   localStorage.setItem('darkMode', null);
}

if (darkMode === 'enabled') {
  enableDarkMode();
}

darkModeToggle.addEventListener('change', () => {
  darkMode = localStorage.getItem('darkMode');
  if (darkMode !== 'enabled') {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
}); 

