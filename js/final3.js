// --- Constants ---
const youtubePlaylistId = 'PL3tRBEVW0hiA8SaR1o_IqK6AGp5FJt8d2'; // YouTube playlist ID
const youtubeApiKey = 'AIzaSyBZLzYf_Ho1Tz7Xbis2NTL_EAa1IlFJWcc'; // YouTube API key
const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${youtubePlaylistId}&key=${youtubeApiKey}&maxResults=5`; // API endpoint
const youtubeIframeSrc = `https://www.youtube.com/embed?listType=playlist&list=${youtubePlaylistId}&loop=1&modestbranding=1&rel=0`; // Removed autoplay

// --- State Variables ---
let player; // YouTube Player instance

// --- Utility Function to Update Status ---
function updateStatus(message, isError = false) {
    const statusDiv = document.getElementById('current-track');
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.style.color = isError ? '#D8000C' : '#555'; // Red for errors, dark gray otherwise
    }
    if (isError) {
        console.error("Status Update (Error):", message);
    } else {
        console.log("Status Update:", message);
    }
}

// --- Initialize Floating Player ---
function initializeFloatingPlayer() {
    const iframe = document.getElementById('youtube-iframe');
    const closeButton = document.getElementById('close-player');
    const floatingPlayer = document.getElementById('floating-player');

    // Restore playback state from localStorage
    const savedState = JSON.parse(localStorage.getItem('youtubePlayerState'));
    if (savedState && iframe) {
        iframe.src = `${youtubeIframeSrc}&start=${savedState.currentTime}`;
    } else {
        iframe.src = youtubeIframeSrc;
    }

    // Save playback state before the page unloads
    window.addEventListener('beforeunload', () => {
        const playerState = {
            currentTime: getCurrentTimeFromIframe(iframe)
        };
        localStorage.setItem('youtubePlayerState', JSON.stringify(playerState));
    });

    // Close the player when the close button is clicked
    closeButton.addEventListener('click', () => {
        floatingPlayer.style.display = 'none';
    });

    // Make the player draggable
    makePlayerDraggable(floatingPlayer);
}

// --- Helper Function: Get Current Time from Iframe ---
function getCurrentTimeFromIframe(iframe) {
    try {
        const url = new URL(iframe.src);
        const startParam = url.searchParams.get('start');
        return startParam ? parseInt(startParam, 10) : 0;
    } catch (error) {
        console.error('Error getting current time from iframe:', error);
        return 0;
    }
}

// --- Helper Function: Make Player Draggable ---
function makePlayerDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        element.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
            element.style.position = 'fixed';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        element.style.cursor = 'grab';
    });
}

// --- Fetch Example: Get Playlist Items ---
function fetchPlaylistItems() {
    fetch(youtubeApiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch playlist items');
            }
            return response.json();
        })
        .then((data) => {
            displayPlaylistItems(data.items);
        })
        .catch((error) => {
            console.error('Error fetching playlist items:', error);
            const container = document.getElementById('playlist-data');
            container.textContent = 'Failed to load playlist items.';
        });
}

// --- XMLHttpRequest Example: Get Playlist Items ---
function xhrPlaylistItems() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', youtubeApiUrl, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            displayPlaylistItems(data.items);
        } else {
            console.error('Error fetching playlist items via XMLHttpRequest:', xhr.statusText);
            const container = document.getElementById('playlist-data');
            container.textContent = 'Failed to load playlist items via XMLHttpRequest.';
        }
    };

    xhr.onerror = function () {
        console.error('Network error occurred while fetching playlist items.');
        const container = document.getElementById('playlist-data');
        container.textContent = 'Network error occurred.';
    };

    xhr.send();
}

// --- Display Playlist Items ---
function displayPlaylistItems(items) {
    const container = document.getElementById('playlist-data');
    container.innerHTML = ''; // Clear existing content

    items.forEach((item) => {
        const videoTitle = item.snippet.title;
        const videoThumbnail = item.snippet.thumbnails.default.url;

        const videoElement = document.createElement('div');
        videoElement.innerHTML = `
            <img src="${videoThumbnail}" alt="${videoTitle}" style="width: 120px; height: 90px; margin-right: 10px;">
            <span>${videoTitle}</span>
        `;
        videoElement.style.display = 'flex';
        videoElement.style.alignItems = 'center';
        videoElement.style.marginBottom = '10px';

        container.appendChild(videoElement);
    });
}

// --- Global Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Dynamically inject the floating player into the page
    const playerHTML = `
        <div id="floating-player" style="position: fixed; bottom: 20px; right: 20px; width: 300px; height: 166px; z-index: 1000; background: #000; border: 2px solid #555; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); cursor: grab;">
            <iframe id="youtube-iframe" 
                    width="100%" 
                    height="100%" 
                    src="${youtubeIframeSrc}" 
                    frameborder="0" 
                    allow="encrypted-media" 
                    allowfullscreen>
            </iframe>
            <button id="close-player" style="position: absolute; top: 5px; right: 5px; background: #ff4d4d; color: #fff; border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 14px; cursor: pointer;">×</button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', playerHTML);

    // Initialize the floating player
    initializeFloatingPlayer();
});