function processUserInput(input) {
    let actions = ["bounce", "single-file", "scatter", "spin", "pulse", "wave"];
    let response = "";

    if (actions.includes(input)) {
        response = `Executing '${input}' action...`;
    } else if (input === "stop") {
        response = "Halting all animations.";
    } else {
        response = "Unknown command. Try 'bounce', 'single-file', 'scatter', etc.";
    }
    
    //the switch case takes a few different words and then outputs a different message based on the word. I'm going to try to make it so that the cubes will move in a different way based on the word.
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

    // Example of calculating a numerical effect
    let speeds = [1, 2, 3, 4, 5]; // Animation Speeds
    for (let i = 0; i < speeds.length; i++) {
        speeds[i] *= 2; // Example modification
    }
    
    return response;
}

// Example usage:
console.log(processUserInput("bounce"));
