
function capturePhoto() {
  if (Modernizr.getusermedia) {
  } else {
    alert('Camera is not supported in your browser');
  }
}