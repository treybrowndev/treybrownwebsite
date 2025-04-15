document.addEventListener('DOMContentLoaded', () => {
    // Part 1: Form with checkboxes and textbox
    const form = document.createElement('form');
    form.innerHTML = `
        <label>
            Select your favorite fruits:
            <input type="checkbox" name="fruits" value="Apple"> Apple
            <input type="checkbox" name="fruits" value="Banana"> Banana
            <input type="checkbox" name="fruits" value="Cherry"> Cherry
        </label>
        <br>
        <label>
            Enter your favorite color:
            <input type="text" id="colorInput">
        </label>
        <br>
        <button type="button" id="submitBtn">Submit</button>
        <button type="button" id="clearBtn">Clear</button>
    `;
    document.body.appendChild(form);
    //the form allows the user to select a fruit and a color and then submit it.

    const selections = {
        fruits: [],
        color: ''
    }; //fruit array and color string

    document.getElementById('submitBtn').addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('input[name="fruits"]:checked');
        selections.fruits = Array.from(checkboxes).map(cb => cb.value);
        selections.color = document.getElementById('colorInput').value;
//if the user selects a fruit and a color, it will display the fruit and color on the page.
        displaySelections();
    });

    document.getElementById('clearBtn').addEventListener('click', () => {
        selections.fruits = [];
        selections.color = '';
        displaySelections();
        //if the user clears the selection, it will clear the fruit and color from the page.
    });

    function displaySelections() {
        const output = document.getElementById('output') || document.createElement('div');
        output.id = 'output';
        output.innerHTML = `
            <h3>Your Selections:</h3>
            <p>Fruits: ${selections.fruits.join(', ')}</p>
            <p>Color: ${selections.color}</p>
        `;
        //displays the fruit and color on the page.
        document.body.appendChild(output);
    }

    // Part 2: Regular expression for phone number
    const phoneForm = document.createElement('form');
    phoneForm.innerHTML = `
        <label>
            Enter your phone number:
            <input type="text" id="phoneInput">
        </label>
        <br>
        <button type="button" id="phoneSubmitBtn">Submit</button>
    `;
    document.body.appendChild(phoneForm);

    document.getElementById('phoneSubmitBtn').addEventListener('click', () => {
        const phoneInput = document.getElementById('phoneInput').value;
        const phoneRegex = /^\d{10}$/;
        if (phoneRegex.test(phoneInput)) {
            alert('Phone number is valid');
        } else {
            alert('Phone number is invalid. Please enter a 10-digit number.');
        }
    });

    // Part 3: File upload and display contents
    const fileForm = document.createElement('form');
    fileForm.innerHTML = `
        <label>
            Upload a file:
            <input type="file" id="fileInput">
        </label>
        <br>
        <button type="button" id="fileSubmitBtn">Upload</button>
    `;
    document.body.appendChild(fileForm);

    document.getElementById('fileSubmitBtn').addEventListener('click', () => {
        const fileInput = document.getElementById('fileInput').files[0];
        if (fileInput) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const fileContents = e.target.result;
                const fileOutput = document.getElementById('fileOutput') || document.createElement('div');
                fileOutput.id = 'fileOutput';
                fileOutput.innerHTML = `
                    <h3>File Contents:</h3>
                    <pre>${fileContents}</pre>
                `;
                document.body.appendChild(fileOutput);
            };
            reader.readAsText(fileInput);
        } else {
            alert('Please select a file to upload.');
        }
        //allows the user to upload a file and then displays the contents of the file on the page.
    });
});