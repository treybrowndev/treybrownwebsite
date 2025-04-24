const clientId = '29db2d5742d54c6fa4bd8739ada8afe7'; // Replace with your Spotify Client ID
const redirectUri = 'https://brownieact4.github.io/thetreycave/index.html'; // Replace with your redirect URI
const clientSecret = '41d75f8491db4dbfa473687be052fa2b'; // Replace with your Spotify Client Secret
const playlistId = '3ejDExfJryN07kp6sAt0TR'; // Replace with your Spotify Playlist ID

let player;
let accessToken;

// Function to authenticate the user and get an access token
async function authenticateUser() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
            redirectUri
        )}&scope=streaming%20user-read-email%20user-read-private%20user-modify-playback-state%20user-read-playback-state`;
        window.location.href = authUrl;
    } else {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
            }),
        });

        const data = await response.json();
        accessToken = data.access_token;
        initializePlayer();
    }
}

// Function to initialize the Spotify Web Playback SDK
function initializePlayer() {
    window.onSpotifyWebPlaybackSDKReady = () => {
        player = new Spotify.Player({
            name: 'TreyCave Player',
            getOAuthToken: (cb) => {
                cb(accessToken);
            },
            volume: 0.5,
        });

        // Connect the player
        player.connect();

        // Event listeners
        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            playPlaylist(device_id);
        });

        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });
    };
}

// Function to play the playlist
function playPlaylist(deviceId) {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            context_uri: `spotify:playlist:${playlistId}`,
            offset: { position: 0 },
        }),
    });
}

// Function to handle music settings
function handleMusicSettings() {
    const volumeSlider = document.getElementById('volume');
    const playbackMode = document.getElementById('playback-mode');

    // Adjust volume
    volumeSlider.addEventListener('input', (event) => {
        const volume = event.target.value / 100;
        if (player) {
            player.setVolume(volume).then(() => {
                console.log(`Volume set to ${volume}`);
            });
        }
    });

    // Handle playback mode
    playbackMode.addEventListener('change', (event) => {
        const mode = event.target.value;
        if (mode === 'shuffle') {
            fetch('https://api.spotify.com/v1/me/player/shuffle?state=true', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } else if (mode === 'repeat') {
            fetch('https://api.spotify.com/v1/me/player/repeat?state=context', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } else {
            fetch('https://api.spotify.com/v1/me/player/repeat?state=off', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        }
    });
}

// Authenticate the user and initialize the player
document.addEventListener('DOMContentLoaded', () => {
    authenticateUser();
    handleMusicSettings();
});