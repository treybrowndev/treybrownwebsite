// proj5.js

document.addEventListener("DOMContentLoaded", function () {
    // Requirement #1 - Overlay Lightbox and Image Swap
    const thumbnail = document.getElementById("thumbnail");
    const overlay = document.getElementById("overlay");
    const overlayImage = document.getElementById("overlay-image");

    // Show overlay on image click
    thumbnail.addEventListener("click", function () {
        overlay.style.display = "flex"; // Show overlay
        overlayImage.style.opacity = "0"; // Start with hidden image

        // Swap to a different version of the image 
        setTimeout(() => {
            overlayImage.src = "large-image.jpg"; // 
            overlayImage.style.opacity = "1"; // Smooth transition effect
        }, 100);
    });

    // Hide overlay when clicked
    overlay.addEventListener("click", function () {
        overlay.style.display = "none"; // Hide overlay when clicked
    });

    // Requirement #3 - Using createElement and appendChild (Nodes Example)
    const caption = document.createElement("p");
    caption.innerText = "This is an overlay image!";
    caption.style.color = "white";
    caption.style.textAlign = "center";
    caption.style.position = "absolute";
    caption.style.bottom = "10px";
    caption.style.fontSize = "18px";

    // Append in overlay
    overlay.appendChild(caption);
});
