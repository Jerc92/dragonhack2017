var vid = document.getElementById('videoel');
var happy = 0;
/********** check and set up video/webcam **********/

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

// check for camerasupport
if (navigator.getUserMedia) {
	// set up stream

	var videoSelector = {video : true};
	if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
		var chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
		if (chromeVersion < 20) {
			videoSelector = "video";
		}
	};

	navigator.getUserMedia(videoSelector, function( stream ) {
		if (vid.mozCaptureStream) {
			vid.mozSrcObject = stream;
		} else {
			vid.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
		}
		vid.play();
	}, function() {
		alert("There was some problem trying to fetch video from your webcam. If you have a webcam, please make sure to accept when the browser asks for access to your webcam.");
	});
} else {
	alert("This demo depends on getUserMedia, which your browser does not seem to support. :(");
}

vid.addEventListener('canplay', startVideo, false);

/*********** setup of emotion detection *************/

// set eigenvector 9 and 11 to not be regularized. This is to better detect motion of the eyebrows
pModel.shapeModel.nonRegularizedVectors.push(9);
pModel.shapeModel.nonRegularizedVectors.push(11);

var ctrack = new clm.tracker({useWebGL : true});
ctrack.init(pModel);

function startVideo() {
	// start video
	vid.play();
	// start tracking
	ctrack.start(vid);
	// start loop to draw face
	drawLoop();
}

function drawLoop() {
	requestAnimationFrame(drawLoop);
	//psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
	var cp = ctrack.getCurrentParameters();

	var er = ec.meanPredict(cp);
	if (er) {
		happy = er[0].value;
	} else {
		happy = 0; // no face detected
	}
}

delete emotionModel['disgusted'];
delete emotionModel['fear'];
delete emotionModel['angry'];
delete emotionModel['sad'];
delete emotionModel['surprised'];
var ec = new emotionClassifier();
ec.init(emotionModel);
var emotionData = ec.getBlank();

function showEmotion() {
	return happy;
}