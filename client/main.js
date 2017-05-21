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
function getAvg(grades) {
  if (grades.length <= 0) {
    return 0;
  }
  return grades.reduce(function (p, c) {
    return p + c;
  }) / grades.length;
}

const videos = shuffle(
  ['5dsGWM5XGdg', 
  'vEO4WavlXdA', 
  'VoJ-Ey6q8uM',
  'TneTkj7pChw', 
  'TxyvS85GyqM',
  'fN6eaOR73SM',
  'd67OfAAjsgM',
  '_hnJW-hAp3o',
  'U4Rk8eVxlyA',
  'be4cMyVB-4U',
  'TWzMfzIEVzE',
  '3LPB-uV0rhs',
  'eHDn7nz_8iw',
  'g61LFS504Rw',
  'b0R0KgEproU',
  'XWz6F6veXnY',
  '2A6zAX2QihE'
  ]);
const youtubeURL = 'https://www.youtube.com/embed/';
let currentVideoIndex = 0;
let yt = null;
const loadTime = 2000;
var museConnected = false;

window.onload = function() {
  yt = document.getElementById('yt-movie');
  changeVideoSrc();

  setTimeout(() => { setupEventListeners() }, loadTime);
  updateMuseBar();
};

function updateMuseBar() {
  if (museConnected) {
    document.getElementById('footer').style.display = 'block';
  } else {
    document.getElementById('footer').style.display = 'none';
  }
}

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
  let jawBuffer = [];
  let faceBuffer = [];

  let jawValues = [];
  let faceValues = [];

  setInterval(() => {
    let hasLolled = false;

    const avgJaw = getAvg(jawValues);
    const avgFace = getAvg(faceValues);

    console.log('the avg of jaws:', avgJaw);
    console.log('the avg of faces:', avgFace);

    if (avgJaw >= 0.35 || avgFace >= 0.25) {
      hasLolled = true;
    }

    console.log('The user has', hasLolled ? '' : 'not', 'lolled');

    if (!hasLolled) {
      nextVideo();
    }
    hasLolled = false;
    jawValues = [];
    faceValues = [];
  }, 10000);


  socket.on('/muse/elements/jaw_clench', function onSocketEvent(data) {
    updateMuseBar();
    if (museConnected) {
      jawBuffer.push(data.values);
      if (jawBuffer.length >= 5) {
        const jawValue = getAvg(jawBuffer);
        jawValues.push(jawValue);
        jawBuffer = [];
        console.log('jaw:', jawValue);
      }
    }
  });
  setInterval(() => {
    faceBuffer.push(showEmotion());
    if (faceBuffer.length >= 5) {
      const faceValue = getAvg(faceBuffer);
      faceValues.push(faceValue);
      faceBuffer = [];
      console.log('face', faceValue);
    }
  }, 100);
}