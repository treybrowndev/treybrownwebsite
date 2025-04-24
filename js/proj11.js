// --- Constants ---
const youtubePlaylistId = 'PL3tRBEVW0hiA8SaR1o_IqK6AGp5FJt8d2'; // Replace with your YouTube playlist ID
const youtubeApiKey = 'AIzaSyBZLzYf_Ho1Tz7Xbis2NTL_EAa1IlFJWcc'; // Replace with your YouTube API key

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
}

// Load the YouTube IFrame API script
(function loadYouTubeAPI() {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);
})();