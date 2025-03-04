// Function to process user input and trigger different cube animations.
function processUserInput(input) {
    let actions = ["bounce", "single-file", "scatter", "spin", "pulse", "wave"];
    let response = "";

    // Check if the input matches one of the predefined actions
    if (actions.includes(input)) {
        response = `Executing '${input}' action...`;
    } else if (input === "stop") {
        response = "Halting all animations.";
    } else {
        response = "Unknown command. Try 'bounce', 'single-file', 'scatter', etc.";
    }
    
    // The switch case takes a few different words and then outputs a different message based on the word.
    // This will later be used to make cubes move differently based on the command.
    switch (input) {
        case "bounce":
            console.log("Cubes will bounce!");
            break;
        case "single-file":
            console.log("Cubes will align in a row!");
            break;
        case "scatter":
            console.log("Cubes will move randomly!");
            break;
        case "spin":
            console.log("Cubes will rotate!");
            break;
        case "pulse":
            console.log("Cubes will expand and shrink!");
            break;
        case "wave":
            console.log("Cubes will move like a wave!");
            break;
        default:
            console.log("No animation for this input.");
    }

    // Example of calculating a numerical effect (adjusting animation speeds)
    let speeds = [1, 2, 3, 4, 5]; // Different speed levels for animations
    for (let i = 0; i < speeds.length; i++) {
        speeds[i] *= 2; // Example modification: doubling each speed
    }
    
    return response;
}

// Function to get input from the user and display the output
function handleInput() {
    let userInput = document.getElementById("user-command").value.toLowerCase(); // Convert input to lowercase
    let outputText = processUserInput(userInput); // Process input
    document.getElementById("output").textContent = outputText; // Display the response
}
