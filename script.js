const videoElem = document.getElementById("video");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");

var mediaRecorder;

var chunks = [];

// Options for getDisplayMedia()

var displayMediaOptions = {
  video: {
    cursor: "always",
    logicalSurface: true
  },
  audio: false
};

// Set event listeners for the start and stop buttons
startElem.addEventListener("click", function(evt) {
  startCapture();
  startElem.style.display = 'none';
  stopElem.style.display = 'block';
}, false);

stopElem.addEventListener("click", function(evt) {
  stopCapture();
  startElem.style.display = 'block';
  stopElem.style.display = 'none';
}, false);

async function startCapture() {
  try {
    let stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

    stream.onstop = function(e){
        console.log('here');
    };
    
    videoElem.srcObject = stream;
    
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = function(e) {
        chunks.push(e.data);
    }

    mediaRecorder.onstop = function(){
        let blob = new Blob(chunks, {'type': 'video/mp4'});
        chunks = [];
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'recording.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    mediaRecorder.start();
  } catch(err) {
    console.error("Error: " + err);
  }
}


function stopCapture() {
    if (!videoElem.srcObject){
        return;
    }

    let tracks = videoElem.srcObject.getTracks();

    tracks.forEach(track => track.stop());
    videoElem.srcObject = null;

    if (mediaRecorder){
        mediaRecorder.stop();
    }
}