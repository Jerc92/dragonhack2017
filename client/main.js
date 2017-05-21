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
let lolMeter = 0;
const loadTime = 2000;
const lolTime = 15000;

window.onload = function() {
  yt = document.getElementById('yt-movie');
  changeVideoSrc();

  setTimeout(() => { setupEventListeners() }, loadTime);
  updateMuseBar();
};

function updateMuseBar() {
  // if (museConnected) {
  //   document.getElementById('footer').style.display = 'inline-block';
  // } else {
  //   document.getElementById('footer').style.display = 'none';
  // }
}

socket.on('muse_connected', function(data){
    museConnected = true;
});

socket.on('muse_disconnected', function(){
    museConnected = false;
})

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
var flashColor = 'red';
function flashBackground(flash) {
  if (flash) $('body').addClass('blink');
  else $('body').removeClass('blink');
  // isFlashing = true;
  // setTimeout(() => {
  //   if (!isFlashing) {
  //     $('body').css('background-color', flashColor);
  //     flashColor = flashColor === 'red' ? 'yellow' : 'red';
  //   }
  //   isFlashing = false;
  // }, 50);
  // $('body').css('background-color', '#2a2d37');
}

function setupEventListeners() {
  let jawBuffer = [];
  let faceBuffer = [];

  let jawValues = [];
  let faceValues = [];
  var timer = null;

  function updateLolMeter(didLol, lolAmount) {
    if (didLol) {
      lolMeter < 100 ? lolMeter += lolAmount : lolMeter = 100;
    } else {
      lolMeter > 0 ? lolMeter -= lolAmount : lolMeter = 0;
    }

    if (lolMeter > 50 && timer !== null) {
      $("#lol-meter").css('background-color', '#82c655');
      console.log('LOLLING > 50!!');
      clearInterval(timer);
      timer = setInterval(processLol, lolTime);
    } else {
      $("#lol-meter").css('background-color', '#3bafda');
    }
    $("#lol-meter").css("width", lolMeter+"%");

    flashBackground(lolMeter > 85);
  }


  function processLol() {
    let hasLolled = false;

    if (lolMeter >= 50) {
      hasLolled = true;
    }

    console.log('The user has', hasLolled ? '' : 'not', 'lolled');

    if (!hasLolled) {
      nextVideo();
    }
    hasLolled = false;
    jawValues = [];
    faceValues = [];
  }

  timer = setInterval(processLol, lolTime);


  socket.on('/muse/elements/jaw_clench', function onSocketEvent(data) {
    updateMuseBar();
    let jawValue = 0;
    jawBuffer.push(data.values);
    if (jawBuffer.length >= 5) {
      jawValue = getAvg(jawBuffer);
      jawValues.push(jawValue);
      jawBuffer = [];
      console.log('jaw:', jawValue);

      updateLolMeter(jawValue >= 0.35, 4);
    }
  });

  let prevFaceValue = -1;

  setInterval(() => {
    faceBuffer.push(showEmotion());
    let faceValue = 0;
    if (faceBuffer.length >= 5) {
      faceValue = getAvg(faceBuffer);

      if (faceValue !== prevFaceValue) {
        faceValues.push(faceValue);
        console.log('face', faceValue);
        $("#faceRecognitionCheck").removeClass("alert-warning");
        $("#faceRecognitionCheck").addClass("alert-success");
      } else {
        faceValues.push(0);
        console.log('face', 0);
        $("#faceRecognitionCheck").addClass("alert-warning");
        $("#faceRecognitionCheck").removeClass("alert-success");
      }
      prevFaceValue = faceValue;
      faceBuffer = [];

      updateLolMeter(faceValue >= 0.25, 10);
    }
  }, 100);
}