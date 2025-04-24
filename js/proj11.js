// --- Constants ---
const youtubePlaylistId = 'PL3tRBEVW0hiA8SaR1o_IqK6AGp5FJt8d2'; // YouTube playlist ID
const youtubeApiKey = 'AIzaSyBZLzYf_Ho1Tz7Xbis2NTL_EAa1IlFJWcc'; // YouTube API key
const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${youtubePlaylistId}&key=${youtubeApiKey}&maxResults=5`; // API endpoint

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

// --- Initialize YouTube Player ---
function initializePlayer() {
    const iframeContainer = document.getElementById('playlist-container');

    // Create the YouTube iframe
    const iframe = document.createElement('div');
    iframe.setAttribute('id', 'youtube-player');
    iframeContainer.appendChild(iframe);

    // Initialize the YouTube Player
    player = new YT.Player('youtube-player', {
        height: '166', // Small height for a compact player
        width: '300', // Small width for a compact player
        playerVars: {
            listType: 'playlist',
            list: youtubePlaylistId,
            autoplay: 1,
            loop: 1,
            modestbranding: 1,
            rel: 0,
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        },
    });
}

// --- YouTube Player Event Handlers ---
function onPlayerReady(event) {
    console.log('YouTube Player is ready.');
    updateStatus('Player ready. Use the controls below to play music.');
    enableControls();
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        console.log('Playback started.');
        updateStatus('Now Playing...');
    } else if (event.data === YT.PlayerState.PAUSED) {
        console.log('Playback paused.');
        updateStatus('Playback paused.');
    } else if (event.data === YT.PlayerState.ENDED) {
        console.log('Playback finished.');
        updateStatus('Playback finished.');
    }
}

// --- Playback Control Functions ---
function togglePlay() {
    const playerState = player.getPlayerState();
    if (playerState === YT.PlayerState.PLAYING) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

function nextTrack() {
    player.nextVideo();
}

function previousTrack() {
    player.previousVideo();
}

function setVolume(volumeLevel) {
    player.setVolume(volumeLevel * 100); // YouTube volume is 0-100
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

// --- UI Interaction Setup ---
function handleMusicSettings() {
    const volumeSlider = document.getElementById('volume');
    const playPauseButton = document.getElementById('play-pause');
    const prevButton = document.getElementById('previous');
    const nextButton = document.getElementById('next');

    // Volume Listener
    volumeSlider.addEventListener('input', (event) => {
        const volume = event.target.value / 100;
        setVolume(volume);
    });

    // Button Listeners
    playPauseButton.addEventListener('click', togglePlay);
    prevButton.addEventListener('click', previousTrack);
    nextButton.addEventListener('click', nextTrack);
}

// --- UI State Management ---
function enableControls() {
    document.getElementById('volume').disabled = false;
    document.getElementById('play-pause').disabled = false;
    document.getElementById('previous').disabled = false;
    document.getElementById('next').disabled = false;
}

function disableControls() {
    document.getElementById('volume').disabled = true;
    document.getElementById('play-pause').disabled = true;
    document.getElementById('previous').disabled = true;
    document.getElementById('next').disabled = true;
}

// --- Global Initialization ---
function onYouTubeIframeAPIReady() {
    console.log('YouTube IFrame API is ready. Initializing player...');
    updateStatus('Initializing player...');
    handleMusicSettings();
    disableControls();
    initializePlayer();
    fetchPlaylistItems(); // Fetch playlist items using fetch
    // xhrPlaylistItems(); // Uncomment to use XMLHttpRequest instead
}

// Load the YouTube IFrame API script
(function loadYouTubeAPI() {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);
})();