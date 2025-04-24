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

// --- YouTube Playlist (JSON Fetching) ---
export async function fetchYouTubePlaylist(playlistId, apiKey) {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=10&key=${apiKey}`;
    const playlistContainer = document.getElementById('playlist-container');

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (playlistContainer) {
            playlistContainer.innerHTML = ''; // Clear existing content
            data.items.forEach((item) => {
                const videoTitle = item.snippet.title;
                const videoId = item.snippet.resourceId.videoId;

                const videoElement = document.createElement('div');
                videoElement.classList.add('playlist-item');
                videoElement.innerHTML = `
                    <p>${videoTitle}</p>
                    <button onclick="playVideo('${videoId}')">Play</button>
                `;
                playlistContainer.appendChild(videoElement);
            });
        }
    } catch (error) {
        console.error('Error fetching YouTube playlist:', error);
    }
}

// --- YouTube Playlist (XML Parsing) ---
export async function fetchYouTubePlaylistXML(playlistId, apiKey) {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=10&key=${apiKey}`;
    const playlistContainer = document.getElementById('playlist-container');

    try {
        const response = await fetch(url);
        const textData = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(textData, 'application/xml');

        if (playlistContainer) {
            playlistContainer.innerHTML = ''; // Clear existing content
            const items = xmlDoc.getElementsByTagName('item');
            Array.from(items).forEach((item) => {
                const videoTitle = item.getElementsByTagName('title')[0].textContent;
                const videoId = item.getElementsByTagName('resourceId')[0].textContent;

                const videoElement = document.createElement('div');
                videoElement.classList.add('playlist-item');
                videoElement.innerHTML = `
                    <p>${videoTitle}</p>
                    <button onclick="playVideo('${videoId}')">Play</button>
                `;
                playlistContainer.appendChild(videoElement);
            });
        }
    } catch (error) {
        console.error('Error parsing YouTube playlist XML:', error);
    }
}

export function playVideo(videoId) {
    const iframe = document.getElementById('youtube-iframe');
    if (iframe) {
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;
    }
}