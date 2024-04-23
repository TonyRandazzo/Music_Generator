let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

function playSound(id) {
  var audio = document.getElementById(id);
  audio.play();
}

function startRecording() {
  if (!isRecording) {
    isRecording = true;
    recordedChunks = [];
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function(stream) {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = function(event) {
          recordedChunks.push(event.data);
        };
        mediaRecorder.start();
      })
      .catch(function(err) {
        console.error('Error accessing microphone:', err);
      });
  }
}

function stopRecording() {
  if (isRecording && mediaRecorder.state !== 'inactive') {
    isRecording = false;
    mediaRecorder.stop();
    mediaRecorder.onstop = function() {
      const blob = new Blob(recordedChunks, { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recorded.mp3';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    };
  }
}
