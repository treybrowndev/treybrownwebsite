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

// --- Authentication ---
async function authenticateUser() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    // If we don't have a code, redirect to Spotify for authorization
    if (!code) {
        const scope = 'streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state';
        const authUrl = `${AUTHORIZE_ENDPOINT}?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
        window.location.href = authUrl; // Redirect user
    } else {
        // We have a code, exchange it for an access token
        try {
            const response = await fetch(TOKEN_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    // Basic Authentication requires base64 encoding
                    'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: redirectUri,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Token exchange failed: ${response.statusText} - ${errorData.error_description || errorData.error || ''}`);
            }

            const data = await response.json();
            accessToken = data.access_token;
            // Optional: Handle refresh tokens if needed for longer sessions (more complex)
            // const refreshToken = data.refresh_token;

            if (accessToken) {
                console.log("Access Token obtained successfully.");
                // Remove code from URL BARE MINIMUM - better to use history.pushState
                window.history.replaceState({}, document.title, window.location.pathname);
                initializePlayer(); // Initialize player AFTER getting the token
            } else {
                console.error('Failed to retrieve access token from response.');
            }
        } catch (error) {
            console.error('Error during token exchange:', error);
            // Optionally, redirect back to login or show an error message
        }
    }
}

// --- Player Initialization ---
function initializePlayer() {
    // Ensure the SDK script is loaded before proceeding
    if (typeof Spotify === 'undefined') {
        console.error("Spotify SDK not loaded yet. Retrying in 500ms.");
        setTimeout(initializePlayer, 500);
        return;
    }

    console.log("Initializing Spotify Player SDK...");
    window.onSpotifyWebPlaybackSDKReady = () => {
        console.log("Spotify SDK Ready.");
        player = new Spotify.Player({
            name: 'TreyCave Web Player', // Choose a name for the player instance
            getOAuthToken: cb => {
                // This function provides the SDK with the current access token
                if (!accessToken) {
                    console.error("Access Token not available for SDK.");
                    // Handle this - maybe re-authenticate?
                    return;
                }
                console.log("Providing token to SDK.");
                cb(accessToken);
            },
            volume: 0.5 // Initial volume (0.0 to 1.0)
        });

        // --- Player Event Listeners ---
        player.addListener('ready', ({ device_id }) => {
            console.log('Player Ready with Device ID', device_id);
            currentDeviceId = device_id;
            // Automatically start playing the playlist once the player is ready
            playPlaylist(device_id);
            // Enable controls now that the player is ready
            enableControls();
        });

        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
            // Disable controls or show a message
            disableControls();
        });

        player.addListener('initialization_error', ({ message }) => {
            console.error('Failed to initialize player:', message);
        });

        player.addListener('authentication_error', ({ message }) => {
            console.error('Failed to authenticate player:', message);
            // Access token might be invalid or expired, try re-authenticating
            // alert("Spotify authentication failed. Please try logging in again.");
            // You might want to clear the bad token and trigger authenticateUser() again
            accessToken = null;
            // authenticateUser(); // Careful with loops
        });

        player.addListener('account_error', ({ message }) => {
            console.error('Failed to validate Spotify account:', message);
            // User might need a Premium account
            alert("Spotify Premium is required for playback control.");
        });

        player.addListener('player_state_changed', (state) => {
            if (!state) {
                console.warn("Player state changed to null (potentially disconnected).");
                return;
            }
            console.log('Player state changed:', state);
            // Update UI based on state (e.g., show current track, update play/pause button)
            updateUI(state);
        });

        // --- Connect the Player ---
        player.connect().then(success => {
            if (success) {
                console.log('The Web Playback SDK successfully connected to Spotify!');
            } else {
                 console.error('The Web Playback SDK failed to connect to Spotify.');
            }
        });
    };
    // Trigger the ready function in case the SDK loaded before this script setup
    if (typeof Spotify !== 'undefined' && Spotify.Player) {
         window.onSpotifyWebPlaybackSDKReady();
    }
}

// --- Playback Control Functions ---

// Play the specific playlist
async function playPlaylist(deviceId) {
    if (!deviceId) {
        console.error("No device ID available to start playback.");
        return;
    }
    if (!accessToken) {
         console.error("No access token available to start playback.");
        return;
    }
    console.log(`Attempting to play playlist ${playlistId} on device ${deviceId}`);
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
                // position_ms: 0 // Optional: start from the beginning of the track
            }),
        });

        if (response.status === 204 || response.status === 202) { // 204 No Content (Success), 202 Accepted (might take a moment)
            console.log('Playback started successfully!');
        } else if (response.status === 403) {
             const errorData = await response.json();
             console.error('Error starting playback (403 Forbidden):', response.statusText, errorData);
             alert(`Playback failed: ${errorData.error?.message || 'Check console for details.'} Ensure Spotify Premium is active.`);
        } else if (response.status === 404) {
             const errorData = await response.json();
             console.error('Error starting playback (404 Not Found):', response.statusText, errorData);
             alert(`Playback failed: ${errorData.error?.message || 'Device not found or playlist invalid.'}`);
        }
        else {
            const errorText = await response.text(); // Use text() if JSON parsing fails
            console.error('Error starting playback:', response.status, response.statusText, errorText);
            alert(`Error starting playback: ${response.statusText}. See console.`);
        }
    } catch (error) {
        console.error('Fetch error during playPlaylist:', error);
        alert(`Network error starting playback: ${error.message}`);
    }
}

// Toggle Play/Pause using SDK
function togglePlay() {
    if (!player) return;
    player.togglePlay().then(() => {
        console.log('Toggled playback');
    }).catch(err => console.error('Error toggling play:', err));
}

// Go to Next Track using SDK
function nextTrack() {
    if (!player) return;
    player.nextTrack().then(() => {
        console.log('Skipped to next track.');
    }).catch(err => console.error('Error skipping track:', err));
}

// Go to Previous Track using SDK
function previousTrack() {
    if (!player) return;
    player.previousTrack().then(() => {
        console.log('Skipped to previous track.');
    }).catch(err => console.error('Error going to previous track:', err));
}

// Set Volume using SDK
function setVolume(volumeLevel) { // volumeLevel is 0.0 to 1.0
     if (!player) return;
     player.setVolume(volumeLevel).then(() => {
         console.log(`Volume set to ${volumeLevel * 100}%`);
     }).catch(err => console.error('Error setting volume:', err));
}

// Set Shuffle Mode using API
async function setShuffle(shuffleState) { // shuffleState is true or false
    if (!accessToken) {
        console.error("No access token for shuffle command.");
        return;
    }
    console.log(`Setting shuffle to: ${shuffleState}`);
    try {
        const response = await fetch(`${PLAYER_API_BASE}/shuffle?state=${shuffleState}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        if (response.ok) {
            console.log(`Shuffle successfully set to ${shuffleState}`);
        } else {
            console.error('Error setting shuffle:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Fetch error setting shuffle:', error);
    }
}

// Set Repeat Mode using API
async function setRepeat(repeatMode) { // repeatMode is 'track', 'context', or 'off'
    if (!accessToken) {
        console.error("No access token for repeat command.");
        return;
    }
     console.log(`Setting repeat mode to: ${repeatMode}`);
    try {
        const response = await fetch(`${PLAYER_API_BASE}/repeat?state=${repeatMode}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        if (response.ok) {
            console.log(`Repeat mode successfully set to ${repeatMode}`);
        } else {
            console.error('Error setting repeat mode:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Fetch error setting repeat mode:', error);
    }
}

// --- UI Interaction ---
function handleMusicSettings() {
    const volumeSlider = document.getElementById('volume');
    const playbackModeSelect = document.getElementById('playback-mode');
    const playPauseButton = document.getElementById('play-pause');
    const prevButton = document.getElementById('previous');
    const nextButton = document.getElementById('next');
    const currentTrackDiv = document.getElementById('current-track'); // Add this to HTML

    if (!volumeSlider || !playbackModeSelect || !playPauseButton || !prevButton || !nextButton || !currentTrackDiv) {
        console.warn("One or more control elements not found in the DOM.");
        return; // Don't attach listeners if elements are missing
    }

    // Adjust volume (input event for smoother updates)
    volumeSlider.addEventListener('input', (event) => {
        const volume = event.target.value / 100;
        setVolume(volume); // Use the SDK function
    });

    // Handle playback mode change
    playbackModeSelect.addEventListener('change', (event) => {
        const mode = event.target.value; // 'normal', 'shuffle', 'repeat_context', 'repeat_track'
        switch (mode) {
            case 'normal':
                setShuffle(false);
                setRepeat('off');
                break;
            case 'shuffle':
                setShuffle(true);
                setRepeat('off'); // Usually turn off repeat when shuffle is on
                break;
            case 'repeat_context':
                setShuffle(false); // Turn off shuffle when repeating context
                setRepeat('context');
                break;
            case 'repeat_track':
                 setShuffle(false); // Turn off shuffle when repeating track
                setRepeat('track');
                break;
        }
    });

    // Handle Play/Pause button
    playPauseButton.addEventListener('click', togglePlay);

    // Handle Previous button
    prevButton.addEventListener('click', previousTrack);

    // Handle Next button
    nextButton.addEventListener('click', nextTrack);
}

// Function to enable controls (e.g., when player is ready)
function enableControls() {
     document.getElementById('volume').disabled = false;
     document.getElementById('playback-mode').disabled = false;
     document.getElementById('play-pause').disabled = false;
     document.getElementById('previous').disabled = false;
     document.getElementById('next').disabled = false;
     console.log("Controls Enabled");
}

// Function to disable controls (e.g., when player is not ready)
function disableControls() {
     document.getElementById('volume').disabled = true;
     document.getElementById('playback-mode').disabled = true;
     document.getElementById('play-pause').disabled = true;
     document.getElementById('previous').disabled = true;
     document.getElementById('next').disabled = true;
     document.getElementById('current-track').textContent = 'Player disconnected or not ready.';
     console.log("Controls Disabled");
}

// Function to update UI elements based on player state
function updateUI(state) {
    if (!state) {
        disableControls();
        document.getElementById('play-pause').textContent = 'Play';
        return;
    }

    // Update Play/Pause button text
    document.getElementById('play-pause').textContent = state.paused ? 'Play' : 'Pause';

    // Update Volume Slider (if necessary, e.g., volume changed elsewhere)
    // Note: The SDK state doesn't always include volume, you might need player.getVolume()
    player.getVolume().then(volume => {
        document.getElementById('volume').value = volume * 100;
    });


    // Update current track info
    const track = state.track_window.current_track;
    if (track) {
        const trackInfo = `${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`;
        document.getElementById('current-track').textContent = `Now Playing: ${trackInfo}`;
        // You could also display album art: track.album.images[0]?.url
    } else {
        document.getElementById('current-track').textContent = 'No track loaded.';
    }

    // Update shuffle/repeat state in dropdown (might require extra API call if not always in state)
    // This part is tricky as the 'state' object from 'player_state_changed'
    // doesn't reliably contain shuffle/repeat status initiated via API.
    // You might need to fetch the full player state periodically or after commands.
    // For simplicity, we won't automatically update the dropdown here.

     // Ensure controls are enabled if we have state
     enableControls();
}


// --- Initialization ---

// Load the Spotify Web Playback SDK script
const script = document.createElement('script');
script.src = 'https://sdk.scdn.co/spotify-player.js';
script.async = true;
document.head.appendChild(script); // Append earlier to start loading

// Main initialization logic runs after the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded. Setting up UI handlers.");
    handleMusicSettings(); // Setup listeners for controls
    disableControls(); // Disable controls initially until player is ready
    authenticateUser(); // Start the authentication flow
});