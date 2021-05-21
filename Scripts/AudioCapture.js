// set up basic variables for app
const recordingButton = document.querySelector('.recordingButton');
var recordingButtonStatus = false;

const soundClips = document.querySelector('.sound-clips');
const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');

var numOfRecordings = 0;

// visualiser setup - create web audio api context and canvas
var audioStream = []; // Store audio stream

let audioCtx;
const canvasCtx = canvas.getContext("2d");

//main block for doing the audio recording
if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = { audio: true };
  let chunks = [];

  let onSuccess = function(stream) {
    const mediaRecorder = new MediaRecorder(stream);

    visualize(stream);

    recordingButton.onclick = function() {
        recordingButtonStatus = !(recordingButtonStatus)
        
        if (recordingButtonStatus){
            mediaRecorder.start();
            console.log(mediaRecorder.state);
            console.log("recorder started");
            recordingButton.style.background = "red";
            recordingButton.value = "Stop Recording";
            recordingButton.innerHTML = "Stop Recording";
            numOfRecordings = numOfRecordings + 1;
        } else {
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
            console.log("recorder stopped");
            recordingButton.style.background = "";
            recordingButton.style.color = "";
            recordingButton.value = "Start Recording";
            recordingButton.innerHTML = "Start Recording";
            // mediaRecorder.requestData();
        }
    }

    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

    //   const clipName = prompt('Enter a name for your sound clip?','My unnamed clip');
      const clipName = 'Recording ' + numOfRecordings

      const clipContainer = document.createElement('article');
      const clipLabel = document.createElement('p');
      const audio = document.createElement('audio');
      var deleteButton = document.createElement('button');

      clipContainer.classList.add('clip');
      audio.setAttribute('controls', '');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';

    //   if(clipName === null) {
    //     clipLabel.textContent = 'My unnamed clip';
    //   } else {
    //     clipLabel.textContent = clipName;
    //   }

      clipLabel.textContent = clipName;

      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(audio);
      clipContainer.appendChild(deleteButton);
      soundClips.appendChild(clipContainer);

      deleteButton.className = "deleteButton";
      clipLabel.className = 'clipLabel';

      audio.controls = true;
      const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
      
      // Convert Blob to ArrayBuffer
      var fileReader = new FileReader();
      var array;
      fileReader.onload = function() {
        array = this.result;
        console.log("Array contains", array.byteLength, "bytes.");
        console.log(array);
        audioStream.push(array);
        // document.getElementById("demo").innerHTML = audioStream.length;
        console.log(audioStream);
      };
      fileReader.readAsArrayBuffer(blob);

      chunks = [];
      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      console.log("recorder stopped");

      deleteButton.onclick = function(e) {
        let evtTgt = e.target;
        numOfRecordings = numOfRecordings - 1;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      }

      clipLabel.onclick = function() {
        const existingName = clipLabel.textContent;
        const newClipName = prompt('Enter a new name for your sound clip?');
        if(newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      }
    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }

  let onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   console.log('getUserMedia not supported on your browser!');
}

function visualize(stream) {
  if(!audioCtx) {
    audioCtx = new AudioContext();
  }

  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);

  draw()

  function draw() {
    const WIDTH = canvas.width
    const HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    let sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;


    for(let i = 0; i < bufferLength; i++) {

      let v = dataArray[i] / 128.0;
      let y = v * HEIGHT/2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();

  }
}

window.onresize = function() {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();