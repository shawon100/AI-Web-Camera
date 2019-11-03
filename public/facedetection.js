const imageUpload = document.getElementById('imageUpload')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
 
]).then(start)

async function start() {
  const container = document.createElement('div')
  container.style.position = 'relative'
  container.width=400
  container.height=350
  container.style.marginTop="50px"
  document.getElementById('uploads').append(container)
  
  let image
  let canvas
  //document.getElementById('uploads').append('Loaded')
  imageUpload.addEventListener('change', async () => {
    if (image) image.remove()
    if (canvas) canvas.remove()
    image = await faceapi.bufferToImage(imageUpload.files[0])
    image.width=400
    image.height=350
    container.append(image)
    canvas = faceapi.createCanvasFromMedia(image)
    container.append(canvas)
    document.getElementById('load').innerHTML='Predecting...'
    const displaySize = { width: image.width, height: image.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    document.getElementById('load').innerHTML=''
  
    
    
  })
}


