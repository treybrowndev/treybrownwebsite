// --- YouTube Floating Player ---
export function initializeYouTubePlayer() {
    const floatingPlayer = document.getElementById('floating-player');
    const closeButton = document.getElementById('close-player');

    if (floatingPlayer && closeButton) {
        closeButton.addEventListener('click', () => {
            floatingPlayer.style.display = 'none';
        });

        // Optional: Add drag functionality
        let isDragging = false;
        let offsetX, offsetY;

        floatingPlayer.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - floatingPlayer.getBoundingClientRect().left;
            offsetY = e.clientY - floatingPlayer.getBoundingClientRect().top;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                floatingPlayer.style.left = `${e.clientX - offsetX}px`;
                floatingPlayer.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
}

// --- Fetch and Play Videos from Playlist ---
export async function fetchAndPlayYouTubePlaylist(playlistId, apiKey) {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            let currentIndex = 0;

            // Function to play the current video
            const playCurrentVideo = () => {
                const videoId = data.items[currentIndex].snippet.resourceId.videoId;
                playVideo(videoId);
            };

            // Play the first video
            playCurrentVideo();

            // Automatically play the next video when the current one ends
            const iframe = document.getElementById('youtube-iframe');
            iframe.addEventListener('load', () => {
                const videoUrl = iframe.src;
                if (videoUrl.includes('autoplay=1')) {
                    currentIndex = (currentIndex + 1) % data.items.length; // Loop back to the start
                    playCurrentVideo();
                }
            });
        } else {
            console.error('No videos found in the playlist.');
        }
    } catch (error) {
        console.error('Error fetching YouTube playlist:', error);
    }
}

// --- Play Video in Floating Player ---
export function playVideo(videoId) {
    const iframe = document.getElementById('youtube-iframe');
    if (iframe) {
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;
    }
}

// --- Initialize YouTube Player and Fetch Playlist ---
document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'AIzaSyBZLzYf_Ho1Tz7Xbis2NTL_EAa1IlFJWcc'; // Your API key
    const playlistId = 'PLzepT5p3FoK69xsKNUuTxQLNAFP2KptBy'; // Your playlist ID

    initializeYouTubePlayer();

    // Fetch and play videos from the playlist
    fetchAndPlayYouTubePlaylist(playlistId, apiKey);
});