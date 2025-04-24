export function applyPreferences() {
  const params = new URLSearchParams(window.location.search);

  const bgColor = params.get('bgColor') || getCookie('bgColor') || '#ffddb3';
  const textColor = params.get('textColor') || getCookie('textColor') || '#000000';
  const fontSizeValue = params.get('fontSize') || getCookie('fontSize') || '16';
  const fontSize = `${fontSizeValue}px`;

  let styleElement = document.getElementById('dynamicStyles');
  if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'dynamicStyles';
      document.head.appendChild(styleElement);
  }
  styleElement.textContent = `
      body {
          background-color: ${bgColor} !important;
          color: ${textColor} !important;
          font-size: ${fontSize} !important;
      }
  `;

  setCookie('bgColor', bgColor, 7);
  setCookie('textColor', textColor, 7);
  setCookie('fontSize', fontSizeValue, 7);

  const preferencesElement = document.getElementById('currentPreferences');
  if (preferencesElement) {
      preferencesElement.innerText = `Background Color: ${bgColor}, Text Color: ${textColor}, Font Size: ${fontSizeValue}px`;
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}