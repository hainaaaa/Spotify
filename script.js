console.log('Rohify script loaded');

const sections = {
  home: document.getElementById('homeContent'),
  search: document.getElementById('searchContent'),
  recentlyPlayed: document.getElementById('recentlyPlayed'),
  albumView: document.getElementById('albumView'),
};

const playToggle = document.getElementById('playToggle');
const playerControls = document.getElementById('playerControls');
const audioPlayer = document.getElementById('audioPlayer');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let isPlaying = false;
let currentSong = null;
let currentAlbum = null;
let currentIndex = 0;
let recentlyPlayedList = [];
let isShuffle = false;
let isRepeat = false;

function updateGreeting() {
  const hour = new Date().getHours();
  const greetingText = document.getElementById('greetingText');
  if (!greetingText) return;
  if (hour >= 5 && hour < 12) greetingText.textContent = 'Good Morning';
  else if (hour >= 12 && hour < 18) greetingText.textContent = 'Good Afternoon';
  else greetingText.textContent = 'Good Evening';
}
updateGreeting();

// 🎵 SONGS
const albumSongs = {
  'Arirang': [
    { title: 'Aliens', artist: 'BTS', audio: 'music/arirang/Aliens.mp3' },
    { title: 'Body to Body', artist: 'BTS', audio: 'music/arirang/BodytoBody.mp3' },
    { title: 'Hooligan', artist: 'BTS', audio: 'music/arirang/Hooligan.mp3' },
    { title: 'NORMAL (Explicit Ver.)', artist: 'BTS', audio: 'music/arirang/Normal.mp3' },
    { title: 'SWIM', artist: 'BTS', audio: 'music/arirang/SWIM.mp3' }
  ],
  'Lover': [
    { title: 'After Glow', artist: 'Taylor Swift', audio: 'music/lover/Afterglow.mp3' },
    { title: 'Cruel Summer', artist: 'Taylor Swift', audio: 'music/lover/CruelSummer.mp3' },
    { title: 'Daylight', artist: 'Taylor Swift', audio: 'music/lover/Daylight.mp3' },
    { title: 'Its Nice to Have a Friend', artist: 'Taylor Swift', audio: 'music/lover/ItsNiceToHaveAFriend.mp3' },
    { title: 'Paper Rings', artist: 'Taylor Swift', audio: 'music/lover/PaperRings.mp3' }
  ],
  'MyWorld': [
    { title: 'Down To Earth', artist: 'Justin Bieber', audio: 'music/myworld/DownToEarth.mp3' },
    { title: 'Favorite Girl', artist: 'Justin Bieber', audio: 'music/myworld/FavoriteGirl.mp3' },
    { title: 'First Dance', artist: 'Justin Bieber', audio: 'music/myworld/FirstDance.mp3' },
    { title: 'Love Me', artist: 'Justin Bieber', audio: 'music/myworld/LoveMe.mp3' },
    { title: 'One Time', artist: 'Justin Bieber', audio: 'music/myworld/OneTime.mp3' }
  ],
  'Soft': [
    { title: 'Destiny', artist: 'LANY', audio: 'music/soft/Destiny.mp3' },
    { title: 'Good Parts', artist: 'LANY', audio: 'music/soft/GoodParts.mp3' },
    { title: 'Last Forever', artist: 'LANY', audio: 'music/soft/LastForever.mp3' },
    { title: 'Sound of Rain', artist: 'LANY', audio: 'music/soft/SoundOfRain.mp3' },
    { title: 'Why', artist: 'LANY', audio: 'music/soft/Why.mp3' }
  ],
  'SOS': [
    { title: 'Blind', artist: 'SZA', audio: 'music/sos/Blind.mp3' },
    { title: 'Gone Girl', artist: 'SZA', audio: 'music/sos/GoneGirl.mp3' },
    { title: 'Good Days', artist: 'SZA', audio: 'music/sos/GoodDays.mp3' },
    { title: 'Love Language', artist: 'SZA', audio: 'music/sos/LoveLanguage.mp3' },
    { title: 'Snooze', artist: 'SZA', audio: 'music/sos/Snooze.mp3' }
  ]
};

function addToRecentlyPlayed(song) {
  recentlyPlayedList = recentlyPlayedList.filter(s => s.title !== song.title);
  recentlyPlayedList.unshift(song);
  if (recentlyPlayedList.length > 10) recentlyPlayedList.pop();
  renderRecentlyPlayed();
}

function renderRecentlyPlayed() {
  const container = document.getElementById('recentList');
  if (!container) return;

  container.innerHTML = recentlyPlayedList.length
    ? recentlyPlayedList.map((song, i) => `
      <div class="song-item" data-index="${i}">
        <div class="song-info">
          <span class="song-number">${i + 1}</span>
          <div class="song-details">
            <h4>${song.title}</h4>
            <p>${song.artist}</p>
          </div>
        </div>
      </div>
    `).join('')
    : `<p style="color: var(--muted)">No recently played songs yet</p>`;
}

function showSection(name) {
  Object.values(sections).forEach(sec => sec.classList.remove('active'));
  if (sections[name]) sections[name].classList.add('active');
}

function playSong(album, index) {
  const song = albumSongs[album][index];

  currentSong = song;
  currentAlbum = album;
  currentIndex = index;

  audioPlayer.src = song.audio;
  audioPlayer.play();

  isPlaying = true;

  playerControls.style.display = 'flex';
  progressContainer.classList.add('visible');

  updatePlayerUI();
  addToRecentlyPlayed(song);
}

function togglePlayPause() {
  if (!currentSong) return;

  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
  } else {
    audioPlayer.play();
    isPlaying = true;
  }

  updatePlayerUI();
}

function updatePlayerUI() {
  playToggle.innerHTML = isPlaying ? '❚❚' : '▶';

  if (currentSong) {
    trackTitle.textContent = currentSong.title;
    trackArtist.textContent = currentSong.artist;
  }
}

audioPlayer.addEventListener('loadedmetadata', () => {
  progressBar.max = audioPlayer.duration;
  durationEl.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener('timeupdate', () => {
  progressBar.value = audioPlayer.currentTime;
  currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
});

progressBar.addEventListener('input', () => {
  audioPlayer.currentTime = progressBar.value;
});

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

playToggle.addEventListener('click', togglePlayPause);

document.querySelectorAll('.playlist-card').forEach(card => {
  card.addEventListener('click', () => {
    renderAlbumSongs(card.dataset.album);
  });
});

const searchInput = document.getElementById('searchInput');
const searchResults = document.querySelector('.results-list');
const searchStatus = document.querySelector('.search-status');

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();

    showSection('search');

    if (!query) {
      searchResults.innerHTML = '';
      searchStatus.textContent = 'Search for music by title, artist, or album.';
      return;
    }

    let results = [];

    Object.keys(albumSongs).forEach(album => {
      albumSongs[album].forEach((song, index) => {
        if (
          song.title.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query) ||
          album.toLowerCase().includes(query)
        ) {
          results.push({ ...song, album, index });
        }
      });
    });

    renderSearchResults(results);
  });
}

function renderSearchResults(results) {
  if (!results.length) {
    searchResults.innerHTML = '';
    searchStatus.textContent = 'No results found';
    return;
  }

  searchStatus.textContent = `Found ${results.length} result(s)`;

  searchResults.innerHTML = results.map((song, i) => `
    <div class="song-item" data-album="${song.album}" data-index="${song.index}">
      <div class="song-info">
        <span class="song-number">${i + 1}</span>
        <div class="song-details">
          <h4>${song.title}</h4>
          <p>${song.artist}</p>
        </div>
      </div>
    </div>
  `).join('');

  searchResults.querySelectorAll('.song-item').forEach(item => {
    item.addEventListener('click', () => {
      playSong(item.dataset.album, parseInt(item.dataset.index));
    });
  });
}

function renderAlbumSongs(albumName) {
  const songs = albumSongs[albumName];
  const container = document.getElementById('albumContent');
  const title = document.getElementById('albumTitle');

  title.textContent = albumName;

  container.innerHTML = songs.map((song, i) => `
    <div class="song-item" data-index="${i}" data-album="${albumName}">
      <div class="song-info">
        <span class="song-number">${i + 1}</span>
        <div class="song-details">
          <h4>${song.title}</h4>
          <p>${song.artist}</p>
        </div>
      </div>
    </div>
  `).join('');

  showSection('albumView');

  container.querySelectorAll('.song-item').forEach(item => {
    item.addEventListener('click', () => {
      playSong(item.dataset.album, parseInt(item.dataset.index));
    });
  });
}

document.getElementById('recentList').addEventListener('click', (e) => {
  const item = e.target.closest('.song-item');
  if (!item) return;

  const song = recentlyPlayedList[parseInt(item.dataset.index)];
  if (!song) return;

  currentSong = song;
  currentAlbum = song.album;

  audioPlayer.src = song.audio;
  audioPlayer.play();

  isPlaying = true;
  playerControls.style.display = 'flex';
  progressContainer.classList.add('visible');

  updatePlayerUI();
});

playerControls.style.display = 'none';
progressContainer.classList.remove('visible');
showSection('home');
renderRecentlyPlayed();

audioPlayer.addEventListener('ended', () => {
  const songs = albumSongs[currentAlbum];

  if (isRepeat) {
    audioPlayer.currentTime = 0;
    audioPlayer.play();
    return;
  }

  if (isShuffle) {
    const randomIndex = Math.floor(Math.random() * songs.length);
    playSong(currentAlbum, randomIndex);
    return;
  }

  const nextIndex = currentIndex + 1;
  if (nextIndex < songs.length) {
    playSong(currentAlbum, nextIndex);
  } else {
    isPlaying = false;
    currentSong = null;
    playerControls.style.display = 'none';
    progressContainer.classList.remove('visible');
    updatePlayerUI();
  }
});

prevBtn.addEventListener('click', () => {
  if (!currentAlbum) return;
  const newIndex = Math.max(0, currentIndex - 1);
  playSong(currentAlbum, newIndex);
});

nextBtn.addEventListener('click', () => {
  if (!currentAlbum) return;
  const songs = albumSongs[currentAlbum];
  if (isShuffle) {
    playSong(currentAlbum, Math.floor(Math.random() * songs.length));
  } else {
    const newIndex = Math.min(songs.length - 1, currentIndex + 1);
    playSong(currentAlbum, newIndex);
  }
});

shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle('active', isShuffle);
});

repeatBtn.addEventListener('click', () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle('active', isRepeat);
});

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    if (!target) return;

    showSection(target);

    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
