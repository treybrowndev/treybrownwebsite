function applyPreferences() {
    const params = new URLSearchParams(window.location.search);

    const bgColor = params.get('bgColor') || getCookie('bgColor') || '#ffddb3';
    const textColor = params.get('textColor') || getCookie('textColor') || '#000000';
    // Get font size as a string, ensure it's not null, default to '16'
    const fontSizeValue = params.get('fontSize') || getCookie('fontSize') || '16'; 
    // Add 'px' unit for CSS
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
            font-size: ${fontSize} !important; /* Use the variable with 'px' */
        }
    `;

    // When saving to cookie/URL, save just the number so input type="number" works on reload
    setCookie('bgColor', bgColor, 7);
    setCookie('textColor', textColor, 7);
    // Save just the value part without 'px'
    setCookie('fontSize', fontSizeValue, 7); 


    const preferencesElement = document.getElementById('currentPreferences');
    if (preferencesElement) {
        preferencesElement.innerText =
            `Background Color: ${bgColor}, Text Color: ${textColor}, Font Size: ${fontSizeValue}px`; // Display with px
    }
}