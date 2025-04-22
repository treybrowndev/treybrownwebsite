// --- Constants ---
const clientId = '29db2d5742d54c6fa4bd8739ada8afe7'; // Replace with your Spotify Client ID
// WARNING: Exposing clientSecret in frontend code is insecure for production apps.
const clientSecret = '41d75f8491db4dbfa473687be052fa2b'; // Replace with your Spotify Client Secret
const playlistId = '3ejDExfJryN07kp6sAt0TR'; // Replace with your Spotify Playlist ID
// IMPORTANT: Make sure this EXACT URI is registered in your Spotify App settings on the developer dashboard
const redirectUri = 'https://brownieact4.github.io/thetreycave/settings.html';

// --- State Variables ---
let player;
let accessToken;
let currentDeviceId; // Store the device ID

// --- Spotify API Endpoints ---
const AUTHORIZE_ENDPOINT = 'https://accounts.spotify.com/authorize';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const PLAYER_API_BASE = 'https://api.spotify.com/v1/me/player';

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

// --- Authentication ---
async function authenticateUser() {
    updateStatus("Authenticating with Spotify...");
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
        console.log("No authorization code found, redirecting to Spotify for authorization.");
        const scope = 'streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state';
        // Ensure the 'show_dialog=true' parameter is NOT used if you want seamless background refresh later,
        // but it can be useful for forcing login during testing.
        const authUrl = `${AUTHORIZE_ENDPOINT}?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
        window.location.href = authUrl; // Redirect user
        // Execution stops here due to redirect
    } else {
        console.log("Authorization code received, exchanging for token...");
        updateStatus("Exchanging authorization code for token...");
        try {
            const response = await fetch(TOKEN_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: redirectUri, // Must match exactly what was sent in the initial auth request
                }),
            });

            // Clear the code from the URL ASAP using replaceState to avoid issues on refresh
            window.history.replaceState({}, document.title, window.location.pathname);

            if (!response.ok) {
                let errorDetails = `HTTP status ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorDetails += ` - ${errorData.error_description || errorData.error || response.statusText}`;
                } catch (e) {
                    errorDetails += ` - ${response.statusText}`; // Fallback if response is not JSON
                }
                 updateStatus(`Token exchange failed: ${errorDetails}. Please check credentials and redirect URI.`, true);
                throw new Error(`Token exchange failed: ${errorDetails}`);
            }

            const data = await response.json();
            accessToken = data.access_token;

            if (accessToken) {
                console.log("Access Token obtained successfully.");
                updateStatus("Authentication successful. Initializing player...");
                initializePlayer(); // Initialize player AFTER getting the token
            } else {
                updateStatus('Failed to retrieve access token from Spotify response.', true);
                console.error('Failed to retrieve access token from response data:', data);
            }
        } catch (error) {
            updateStatus(`Error during token exchange: ${error.message}`, true);
            console.error('Detailed error during token exchange:', error);
            // Optionally, provide a button to retry authentication
        }
    }
}

// --- Player Initialization ---
function initializePlayer() {
    // Check if the SDK script has loaded the Spotify object
    if (typeof Spotify === 'undefined') {
        updateStatus("Spotify SDK not loaded yet. Retrying...", false);
        console.error("Spotify SDK not loaded yet. Waiting...");
        // Retry after a short delay ONLY if SDK is not loaded. Avoid infinite loops if it consistently fails.
        // Consider adding a maximum retry count.
        setTimeout(initializePlayer, 1000);
        return;
    }

    console.log("Spotify SDK found. Initializing Spotify.Player...");
    updateStatus("Initializing Spotify Player...");

    // This function MUST be defined before the SDK script finishes loading,
    // but since we check for Spotify object first, this should be safe.
    // It's better practice to define this function globally before the SDK script tag if possible.
    window.onSpotifyWebPlaybackSDKReady = () => {
        console.log("onSpotifyWebPlaybackSDKReady called.");
        updateStatus("Spotify SDK Ready. Creating player instance...");

        player = new Spotify.Player({
            name: 'TreyCave Web Player', // Shows up in the Spotify Connect device list
            getOAuthToken: cb => {
                // Provides the SDK with the access token when needed
                if (!accessToken) {
                    updateStatus("Access Token unavailable for SDK.", true);
                    console.error("Access Token requested by SDK but not available.");
                    // Potentially trigger re-authentication here if token expired
                    return; // Don't call cb() if no token
                }
                console.log("Providing token to SDK.");
                cb(accessToken);
            },
            volume: 0.5 // Initial volume (0.0 to 1.0)
        });

        // --- Player Event Listeners ---
        player.addListener('ready', ({ device_id }) => {
            console.log('Player Ready with Device ID:', device_id);
            updateStatus(`Player ready (Device: ${device_id.substring(0,8)}...). Starting playlist...`);
            currentDeviceId = device_id;
            // Enable controls now that the player is ready
            enableControls();
            // Automatically start playing the playlist
            playPlaylist(device_id);
        });

        player.addListener('not_ready', ({ device_id }) => {
            console.warn('Device ID has gone offline:', device_id);
            updateStatus('Player disconnected or went offline.', true);
            // Disable controls or show a message
            disableControls();
        });

        player.addListener('initialization_error', ({ message }) => {
            console.error('Failed to initialize player:', message);
            updateStatus(`Player initialization failed: ${message}`, true);
            disableControls();
        });

        player.addListener('authentication_error', ({ message }) => {
            console.error('Failed to authenticate player:', message);
            updateStatus(`Player authentication failed: ${message}. Token might be invalid or expired.`, true);
            // Access token might be invalid or expired, try re-authenticating?
            accessToken = null; // Clear bad token
            disableControls();
            // Maybe add a "Login Again" button or automatically redirect after a delay
            // updateStatus("Authentication failed. Please refresh to log in again.", true);
        });

        player.addListener('account_error', ({ message }) => {
            console.error('Failed to validate Spotify account:', message);
            // This usually means the user doesn't have Spotify Premium
            updateStatus(`Account error: ${message}. Spotify Premium is required for web playback control.`, true);
            disableControls();
        });

        player.addListener('playback_error', ({ message }) => {
            console.error('Playback Error:', message);
            updateStatus(`Playback error: ${message}`, true);
            // Might occur if trying to play restricted content, etc.
        });


        player.addListener('player_state_changed', (state) => {
            if (!state) {
                console.warn("Player state changed to null (potentially disconnected or idle).");
                // Don't necessarily disable controls here, state might become valid again.
                // Update UI to reflect idle state if needed.
                updateStatus("Player idle or disconnected.");
                document.getElementById('play-pause').textContent = 'Play'; // Set button to 'Play'
                return;
            }
            console.log('Player state changed:', state);
            // Update UI based on the received state
            updateUI(state);
        });

        // --- Connect the Player ---
        console.log("Attempting to connect the player...");
        updateStatus("Connecting to Spotify...");
        player.connect().then(success => {
            if (success) {
                console.log('The Web Playback SDK successfully connected to Spotify!');
                // Don't update status here, wait for the 'ready' event for device ID.
                 updateStatus("Player connected. Waiting for readiness...");
            } else {
                console.error('The Web Playback SDK failed to connect.');
                updateStatus('Failed to connect the player instance. Check console and network logs.', true);
                 disableControls(); // Keep controls disabled if connection fails
            }
        }).catch(err => {
             console.error('Error during player.connect():', err);
             updateStatus(`Error connecting player: ${err.message || err}`, true);
              disableControls();
        });
    };

    // IMPORTANT: Manually trigger the SDK Ready function if the Spotify object
    // already exists when this code runs (e.g., script loaded very quickly).
    if (typeof Spotify !== 'undefined' && Spotify.Player && typeof window.onSpotifyWebPlaybackSDKReady === 'function') {
         console.log("Spotify object already exists, manually triggering onSpotifyWebPlaybackSDKReady.");
         // Wrap in a minimal timeout to ensure the event loop clears,
         // sometimes helps if called too early immediately after script load.
         setTimeout(() => window.onSpotifyWebPlaybackSDKReady(), 0);
    } else {
        console.log("Waiting for onSpotifyWebPlaybackSDKReady to be called by the SDK...");
    }
}

// --- Playback Control Functions ---

// Play the specific playlist using Web API
async function playPlaylist(deviceId) {
    if (!deviceId) {
        updateStatus("Cannot start playback: No active device ID.", true);
        return;
    }
    if (!accessToken) {
        updateStatus("Cannot start playback: No access token.", true);
        return;
    }
    console.log(`Attempting to play playlist ${playlistId} on device ${deviceId}`);
    updateStatus(`Starting playlist ${playlistId}...`);
    try {
        const response = await fetch(`${PLAYER_API_BASE}/play?device_id=${deviceId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                context_uri: `spotify:playlist:${playlistId}`,
                offset: { position: 0 }, // Start from the first track
            }),
        });

        // Check response status
        if (response.status === 204 || response.status === 202) {
            console.log('Playback start command sent successfully!');
            // Don't update status here, wait for player_state_changed event
        } else {
             let errorReason = response.statusText;
             try {
                 const errorData = await response.json();
                 errorReason = errorData.error?.message || errorReason;
             } catch(e) { /* Ignore if response not JSON */ }
            console.error(`Error starting playback API call: ${response.status} ${errorReason}`);
            updateStatus(`Error starting playback: ${errorReason} (Status: ${response.status})`, true);
            // Specific handling for common errors
            if (response.status === 403) {
                 updateStatus(`Playback forbidden: ${errorReason}. Ensure Premium is active and content is available.`, true);
            } else if (response.status === 404) {
                 updateStatus(`Playback failed: ${errorReason}. Device not found or playlist invalid.`, true);
            }
        }
    } catch (error) {
        console.error('Fetch error during playPlaylist:', error);
        updateStatus(`Network error starting playback: ${error.message}`, true);
    }
}

// --- SDK-based Controls ---
function togglePlay() {
    if (!player) return;
    console.log("Attempting to toggle play...");
    player.togglePlay().then(() => {
        console.log('Toggle playback command sent.');
    }).catch(err => console.error('Error toggling play:', err));
}

function nextTrack() {
    if (!player) return;
    console.log("Attempting to skip to next track...");
    player.nextTrack().then(() => {
        console.log('Next track command sent.');
    }).catch(err => console.error('Error skipping track:', err));
}

function previousTrack() {
    if (!player) return;
    console.log("Attempting to skip to previous track...");
    player.previousTrack().then(() => {
        console.log('Previous track command sent.');
    }).catch(err => console.error('Error going to previous track:', err));
}

function setVolume(volumeLevel) { // volumeLevel is 0.0 to 1.0
     if (!player) return;
     console.log(`Attempting to set volume to ${volumeLevel * 100}%...`);
     player.setVolume(volumeLevel).then(() => {
         console.log(`Volume set command sent.`);
     }).catch(err => console.error('Error setting volume:', err));
}

// --- API-based Controls (Shuffle/Repeat) ---
async function setShuffle(shuffleState) { // shuffleState is true or false
    if (!accessToken || !currentDeviceId) {
        updateStatus("Cannot set shuffle: Missing token or device ID.", true);
        return;
    }
    console.log(`Attempting to set shuffle to: ${shuffleState}`);
    // Include device_id for robustness, although often optional if playback is active
    try {
        const response = await fetch(`${PLAYER_API_BASE}/shuffle?state=${shuffleState}&device_id=${currentDeviceId}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        if (response.ok) {
            console.log(`Shuffle successfully set to ${shuffleState}`);
        } else {
            console.error('Error setting shuffle API:', response.status, response.statusText);
             updateStatus(`Failed to set shuffle: ${response.statusText}`, true);
        }
    } catch (error) {
        console.error('Fetch error setting shuffle:', error);
         updateStatus(`Network error setting shuffle: ${error.message}`, true);
    }
}

async function setRepeat(repeatMode) { // repeatMode is 'track', 'context', or 'off'
    if (!accessToken || !currentDeviceId) {
        updateStatus("Cannot set repeat mode: Missing token or device ID.", true);
        return;
    }
     console.log(`Attempting to set repeat mode to: ${repeatMode}`);
     // Include device_id for robustness
    try {
        const response = await fetch(`${PLAYER_API_BASE}/repeat?state=${repeatMode}&device_id=${currentDeviceId}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        if (response.ok) {
            console.log(`Repeat mode successfully set to ${repeatMode}`);
        } else {
            console.error('Error setting repeat mode API:', response.status, response.statusText);
             updateStatus(`Failed to set repeat mode: ${response.statusText}`, true);
        }
    } catch (error) {
        console.error('Fetch error setting repeat mode:', error);
         updateStatus(`Network error setting repeat mode: ${error.message}`, true);
    }
}

// --- UI Interaction Setup ---
function handleMusicSettings() {
    // Get all control elements
    const volumeSlider = document.getElementById('volume');
    const playbackModeSelect = document.getElementById('playback-mode');
    const playPauseButton = document.getElementById('play-pause');
    const prevButton = document.getElementById('previous');
    const nextButton = document.getElementById('next');
    const currentTrackDiv = document.getElementById('current-track'); // Needed for updates

    // Check if all elements exist before adding listeners
    if (!volumeSlider || !playbackModeSelect || !playPauseButton || !prevButton || !nextButton || !currentTrackDiv) {
        console.error("CRITICAL: One or more essential control elements not found in the DOM. Aborting listener setup.");
        updateStatus("UI Error: Control elements missing.", true);
        return;
    }
    console.log("All control elements found. Attaching listeners...");

    // Volume Listener
    volumeSlider.addEventListener('input', (event) => {
        const volume = event.target.value / 100;
        setVolume(volume);
    });

    // Playback Mode Listener
    playbackModeSelect.addEventListener('change', (event) => {
        const mode = event.target.value;
        console.log(`Playback mode dropdown changed to: ${mode}`);
        switch (mode) {
            case 'normal':
                setShuffle(false);
                setRepeat('off');
                break;
            case 'shuffle':
                setShuffle(true);
                setRepeat('off'); // Common practice
                break;
            case 'repeat_context':
                setShuffle(false); // Common practice
                setRepeat('context');
                break;
            case 'repeat_track':
                 setShuffle(false); // Common practice
                setRepeat('track');
                break;
        }
    });

    // Button Listeners
    playPauseButton.addEventListener('click', togglePlay);
    prevButton.addEventListener('click', previousTrack);
    nextButton.addEventListener('click', nextTrack);
}

// --- UI State Management ---
function enableControls() {
     try {
        document.getElementById('volume').disabled = false;
        document.getElementById('playback-mode').disabled = false;
        document.getElementById('play-pause').disabled = false;
        document.getElementById('previous').disabled = false;
        document.getElementById('next').disabled = false;
        console.log("Controls Enabled");
     } catch (e) { console.error("Error enabling controls:", e); }
}

function disableControls(reason = "Player disconnected or not ready.") {
    try {
        document.getElementById('volume').disabled = true;
        document.getElementById('playback-mode').disabled = true;
        document.getElementById('play-pause').disabled = true;
        document.getElementById('previous').disabled = true;
        document.getElementById('next').disabled = true;
        // Optionally update status message when disabling explicitly
        // updateStatus(reason, true); // Uncomment if desired, might overwrite specific error messages
        console.log("Controls Disabled. Reason:", reason);
    } catch (e) { console.error("Error disabling controls:", e); }
}

// Update UI based on player state received from SDK
function updateUI(state) {
    console.log("Updating UI based on new player state.");
    if (!state) {
        // If state becomes null, revert to a basic state
        updateStatus("Player became idle or disconnected.");
        document.getElementById('play-pause').textContent = 'Play';
        // Optionally disable controls here, or leave enabled allowing user to try playing again
        // disableControls();
        return;
    }

    // Ensure controls are enabled if we receive valid state
    enableControls();

    // Update Play/Pause button text based on paused state
    const playPauseButton = document.getElementById('play-pause');
    playPauseButton.textContent = state.paused ? 'Play' : 'Pause';

    // Update Volume Slider
    // Use player.getVolume() as state object doesn't reliably contain it
    player.getVolume().then(volume => {
        if (volume !== null) { // Check if volume is available
            document.getElementById('volume').value = volume * 100;
        }
    }).catch(err => console.warn("Could not get current volume:", err)); // Warn instead of error

    // Update current track info display
    const track = state.track_window.current_track;
    if (track) {
        const trackInfo = `${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`;
         // Use updateStatus to show track info, maintaining color logic
        updateStatus(`Now Playing: ${trackInfo}`);
        // Example: Display album art in the placeholder div
        // const albumArtUrl = track.album.images[0]?.url;
        // const playlistContainer = document.getElementById('playlist-container');
        // if (albumArtUrl && playlistContainer) {
        //     playlistContainer.innerHTML = `<img src="${albumArtUrl}" alt="Album art for ${track.album.name}" style="max-width: 100px; max-height: 100px;">`;
        // }
    } else {
        updateStatus('No track currently loaded.');
    }

    // Update playback mode dropdown based on state (best effort)
    // Note: API-set shuffle/repeat might not reflect instantly/reliably in SDK state object
    const playbackModeSelect = document.getElementById('playback-mode');
    if (state.repeat_mode === 2) { // track
         playbackModeSelect.value = 'repeat_track';
    } else if (state.repeat_mode === 1) { // context
         playbackModeSelect.value = 'repeat_context';
    } else if (state.shuffle) { // shuffle on, repeat off
        playbackModeSelect.value = 'shuffle';
    } else { // shuffle off, repeat off
        playbackModeSelect.value = 'normal';
    }
}


// --- Global Initialization ---

// IMPORTANT: Define onSpotifyWebPlaybackSDKReady globally BEFORE the SDK might load,
// OR ensure the check/trigger inside initializePlayer works reliably.
// Moving the function definition here is safer.
window.onSpotifyWebPlaybackSDKReady = () => {
    console.log("GLOBAL onSpotifyWebPlaybackSDKReady called.");
    // If initializePlayer was waiting, it might call this again, which is okay.
    // If initializePlayer hasn't run yet (e.g., DOMContentLoaded waiting),
    // the check inside initializePlayer will find the Spotify object later.
    // The key is that this function IS defined when the SDK needs it.
};


// Main initialization logic starts after the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded. Setting up UI handlers and starting auth.");
    updateStatus("Page loaded. Setting up controls..."); // Initial status
    handleMusicSettings(); // Setup listeners for controls (buttons, sliders etc.)
    disableControls("Initializing Player..."); // Disable controls initially
    authenticateUser(); // Start the authentication flow -> leads to initializePlayer if successful
});

console.log("final4.js script loaded.");