document.addEventListener('DOMContentLoaded', () => {
    const fontFamilySelect = document.getElementById('font-family-select');
    const fontWeightSelect = document.getElementById('font-weight-select');
    const italicToggle = document.getElementById('italic-toggle');
    const editor = document.getElementById('editor');
    const saveButton = document.getElementById('save-btn');
    const resetButton = document.getElementById('reset-btn');

    let fontData = {};

    async function fetchFontData() {
        try {
            const response = await fetch('fonts.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const fontData = await response.json();
            console.log(fontData); 
        } 
        catch (error) {
            console.error('Error fetching font data:', error);
        }
    }

    function populateFontFamilies() {
        fontFamilySelect.innerHTML = '';
        Object.keys(fontData).forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            fontFamilySelect.appendChild(option);
        });
        fontFamilySelect.dispatchEvent(new Event('change'));
    }

    function populateFontWeights() {
        const selectedFont = fontFamilySelect.value;
        fontWeightSelect.innerHTML = '';

        if (fontData[selectedFont]) {
            const variants = fontData[selectedFont];
            Object.keys(variants).forEach(variant => {
                const option = document.createElement('option');
                option.value = variant;
                option.textContent = variant;
                fontWeightSelect.appendChild(option);
            });

            fontWeightSelect.dispatchEvent(new Event('change'));
        } else {
            console.error('Selected font does not have variants.');
        }
    }

    function updateFont() {
        const selectedFont = fontFamilySelect.value;
        const selectedWeight = fontWeightSelect.value;
        const isItalic = italicToggle.checked;

        if (fontData[selectedFont]) {
            let fontUrl = '';
            if (isItalic && fontData[selectedFont][`${selectedWeight}italic`]) {
                fontUrl = fontData[selectedFont][`${selectedWeight}italic`];
                editor.style.fontStyle = 'italic';
            } else if (fontData[selectedFont][selectedWeight]) {
                fontUrl = fontData[selectedFont][selectedWeight];
                editor.style.fontStyle = 'normal';
            }

            editor.style.fontFamily = selectedFont;
            editor.style.fontWeight = selectedWeight.replace('italic', '');
            editor.style.fontStyle = isItalic ? 'italic' : 'normal';
        }
    }

    function resetEditor() {
        editor.style.fontFamily = '';
        editor.style.fontWeight = '';
        editor.style.fontStyle = 'normal';
        editor.value = ''; 
        fontFamilySelect.value = '';
        fontWeightSelect.innerHTML = '';
        italicToggle.checked = false;
    }

    fontFamilySelect.addEventListener('change', populateFontWeights);
    fontWeightSelect.addEventListener('change', updateFont);
    italicToggle.addEventListener('change', updateFont);

    saveButton.addEventListener('click', () => {
        alert('Changes saved!');
    });

    resetButton.addEventListener('click', () => {
        resetEditor();
    });

    fetchFontData();
});
