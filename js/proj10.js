// Timer variables
let timer;
let secondsElapsed = 0;

// Puzzle pieces and positions
const pieces = [
    { id: "piece1", correctPosition: "slot1" },
    { id: "piece2", correctPosition: "slot2" },
    { id: "piece3", correctPosition: "slot3" },
    { id: "piece4", correctPosition: "slot4" },
];

let completedPieces = 0;

// Shuffle pieces at the start
function shufflePieces() {
    const container = document.getElementById("pieces-container");
    const shuffled = [...container.children];
    shuffled.sort(() => Math.random() - 0.5);
    container.innerHTML = "";
    shuffled.forEach((piece) => container.appendChild(piece));
}

// Start the timer
function startTimer() {
    secondsElapsed = 0;
    document.getElementById("timer").textContent = "Time: 0s";
    timer = setInterval(() => {
        secondsElapsed++;
        document.getElementById("timer").textContent = `Time: ${secondsElapsed}s`;
    }, 1000);
}

// Stop the timer
function stopTimer() {
    clearInterval(timer);
}

// Reset the game
function resetGame() {
    stopTimer();
    completedPieces = 0;
    pieces.forEach((piece) => {
        const element = document.getElementById(piece.id);
        element.classList.remove("correct");
        element.setAttribute("draggable", true);
    });
    shufflePieces();
    startTimer();
}

// Drag-and-drop event handlers
function handleDragStart(event) {
    const piece = event.target.closest(".piece");
    event.dataTransfer.setData("text/plain", piece.id);
}

function handleDragOver(event) {
    event.preventDefault();
    event.target.classList.add("highlight");
}

function handleDragLeave(event) {
    event.target.classList.remove("highlight");
}

function handleDrop(event) {
    event.preventDefault();
    const pieceId = event.dataTransfer.getData("text"); // Get the dragged piece ID
    const piece = document.getElementById(pieceId); // Get the piece element
    const targetSlot = event.target.closest(".slot"); // Get the slot where the piece is dropped

    console.log(`Dropped piece: ${pieceId}`); // Debugging
    console.log(`Target slot: ${targetSlot ? targetSlot.id : "none"}`); // Debugging

    // Check if the slot is valid and matches the correct position
    if (targetSlot && targetSlot.id === pieces.find((p) => p.id === pieceId).correctPosition) {
        targetSlot.appendChild(piece); // Move the piece into the slot
        piece.classList.add("correct"); // Mark the piece as correct
        piece.setAttribute("draggable", false); // Make the piece immovable
        completedPieces++; // Increment the completed pieces counter

        console.log(`Completed pieces: ${completedPieces}`); // Debugging

        // Check if all pieces are in the correct slots
        if (completedPieces === pieces.length) {
            handleCompletion(); // Trigger the win condition
        }
    } else {
        alert("Wrong slot! Try again."); // Optional: Notify the user if the slot is incorrect
    }
}

// Handle game completion
function handleCompletion() {
    stopTimer(); // Stop the timer
    console.log("Puzzle completed!"); // Debugging
    alert(`Congratulations! You completed the puzzle in ${secondsElapsed} seconds.`); // Display success message
    updateBestTime(); // Update the best time in cookies
}
// Update the best time in cookies
function updateBestTime() {
    const bestTime = getCookie("bestTime"); // Get the current best time from cookies
    console.log(`Current best time: ${bestTime}`); // Debugging
    if (!bestTime || secondsElapsed < bestTime) {
        setCookie("bestTime", secondsElapsed, 365); // Update the best time in cookies
        document.getElementById("best-time").textContent = `${secondsElapsed}s`; // Update the scoreboard
        console.log(`New best time set: ${secondsElapsed}s`); // Debugging
    } else {
        document.getElementById("best-time").textContent = `${bestTime}s`; // Display the existing best time
    }
}
// Cookie helper functions
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) return value;
    }
    return null;
}

// Initialize the game
function initGame() {
    const slots = document.querySelectorAll(".slot");

    slots.forEach((slot) => {
        slot.addEventListener("dragover", handleDragOver);
        slot.addEventListener("dragleave", handleDragLeave);
        slot.addEventListener("drop", handleDrop);
    });

    document.getElementById("reset-button").addEventListener("click", resetGame);

    shufflePieces();
    startTimer();
}

// Start the game when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initGame);