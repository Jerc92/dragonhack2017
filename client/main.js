function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

const videos = shuffle(['5dsGWM5XGdg', 'vEO4WavlXdA', 'VoJ-Ey6q8uM',
  'TneTkj7pChw']);
const youtubeURL = 'https://www.youtube.com/embed/';
let currentVideoIndex = 0;
let yt = null;

window.onload = function() {
  yt = document.getElementById('yt-movie');
  changeVideoSrc();

  setupEventListeners();
};

function changeVideoSrc() {
  if (yt !== null) {
    yt.src = `${youtubeURL}${videos[currentVideoIndex]}?autoplay=1`;
  }
}

function nextVideo() {
  if (currentVideoIndex + 1 < videos.length) {
    currentVideoIndex += 1;
  } else {
    currentVideoIndex = 0;
  }
  changeVideoSrc();
}

function setupEventListeners() {
  let hasLolled = false;
  setInterval(() => {
    if (!hasLolled) {
      nextVideo();
    }
    hasLolled = false;
  }, 5000);

  socket.on('/muse/elements/jaw_clench', function onSocketEvent(data) {
    console.log(data);
    if (data.values === 1) {
      hasLolled = true;
    }
  });
}