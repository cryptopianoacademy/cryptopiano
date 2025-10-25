// Global variables
let player;
let currentTrackIndex = 0;
const playlist = PLAYLIST_DATA; // Loaded from playlist_data.js

// DOM elements
const playPauseBtn = document.getElementById('play-pause-btn');
const playPauseIcon = playPauseBtn.querySelector('i');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const volumeSlider = document.getElementById('volume-slider');
const playlistEl = document.getElementById('playlist');
const currentTitleEl = document.getElementById('current-title');

// 1. YouTube Player API Initialization
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0', // Set height to 0 to hide the video player
        width: '0',  // Set width to 0 to hide the video player
        videoId: playlist[currentTrackIndex].videoId,
        playerVars: {
            'playsinline': 1,
            'controls': 0, // Disable default controls
            'disablekb': 1, // Disable keyboard controls
            'rel': 0, // Do not show related videos
            'showinfo': 0, // Hide video title and uploader info
            'modestbranding': 1 // Hide YouTube logo
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    // Set initial volume
    player.setVolume(volumeSlider.value);
    
    // Load the first song
    loadTrack(currentTrackIndex);

    // Attach event listeners after player is ready
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    volumeSlider.addEventListener('input', setVolume);

    // Render the playlist
    renderPlaylist();
}

function onPlayerStateChange(event) {
    // YT.PlayerState.ENDED = 0
    // YT.PlayerState.PLAYING = 1
    // YT.PlayerState.PAUSED = 2
    // YT.PlayerState.BUFFERING = 3
    
    if (event.data === YT.PlayerState.PLAYING) {
        playPauseIcon.className = 'fas fa-pause';
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.BUFFERING) {
        playPauseIcon.className = 'fas fa-play';
    } else if (event.data === YT.PlayerState.ENDED) {
        playNext();
    }
}

// 2. Player Controls
function togglePlayPause() {
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

function playTrack(index) {
    currentTrackIndex = index;
    loadTrack(currentTrackIndex);
    player.playVideo();
}

function loadTrack(index) {
    const track = playlist[index];
    player.loadVideoById(track.videoId);
    currentTitleEl.textContent = track.title;
    updatePlaylistHighlight(index);
}

function playNext() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    playTrack(currentTrackIndex);
}

function playPrevious() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    playTrack(currentTrackIndex);
}

function setVolume() {
    player.setVolume(volumeSlider.value);
}

// 3. Playlist Management
function renderPlaylist() {
    playlistEl.innerHTML = '';
    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${track.title}`;
        li.dataset.index = index;
        li.addEventListener('click', () => {
            playTrack(index);
        });
        playlistEl.appendChild(li);
    });
    // Highlight the first song
    updatePlaylistHighlight(currentTrackIndex);
}

function updatePlaylistHighlight(index) {
    const items = playlistEl.querySelectorAll('li');
    items.forEach((item, i) => {
        item.classList.remove('active');
        if (i === index) {
            item.classList.add('active');
            // Scroll to active item
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

