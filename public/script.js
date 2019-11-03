const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia =  navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
  
    if (navigator.getUserMedia) {
      navigator.getUserMedia({ audio: true, video: { } },
         function(stream) {
            var video = document.querySelector('video');
            video.srcObject = stream;
            video.onloadedmetadata = function(e) {
              video.play();
            };
         },
         function(err) {
            console.log("The following error occurred: " + err.name);
         }
      );
   } else {
      console.log("getUserMedia not supported");
   }
}

video.addEventListener('play', async() => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  video.width=720
  video.height=560
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  const labeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  document.body.append('Loaded')
  setInterval(async () => {
    
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors().withAgeAndGender().withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    results.forEach((result, i) => {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
     
      resizedDetections.forEach(result => {
      const { age, gender, genderProbability,expression } = result
      document.getElementById('load').innerHTML="";
      new faceapi.draw.DrawTextField(
        [

          `Age: ${faceapi.round(age, 0)} years`,
          `Gender: ${gender} (${faceapi.round(genderProbability)})`
        ],
        result.detection.box.bottomRight
      ).draw(canvas)
    })
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
      drawBox.draw(canvas)

    })
  }, 100)
})

function loadLabeledImages() {
  const labels = ['Shawon','Omar', 'Sayef', 'Masrur', 'Abdullah', 'Rashed', 'Monir', 'Imam','Injamam','Masum','Adil']
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`/labeled_images/${label}/${i}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}
