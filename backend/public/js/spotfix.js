

function photoSelected(attachmentElementId, displayElementId) {
  // console.log(attachmentElementId);
  // console.log(displayElementId);
  // var attachment = $(attachmentElementId);
  // if(attachment.target.files.length == 1 && 
  //     attachment.target.files[0].type.indexOf("image/") == 0) {
  //     $(displayElementId).attr("src", URL.createObjectURL(attachment.target.files[0]));
  // }
}


function SpotFixControl(controlDiv, map) {
  // Set CSS styles for the DIV containing the control
  // Setting padding to 10 px will offset the control
  // from the edge of the map.
  controlDiv.style.padding = '10px';

  // Set CSS for + button which launches a reveal modal.
  var controlUI = document.createElement('a');
  controlUI.setAttribute('href', "#");
  controlUI.setAttribute('data-reveal-id', "new-sf-modal");
  controlUI.className = "button alert round";
  controlUI.innerHTML = "+";
  controlUI.style.fontFamily = 'sans-serif';
  controlUI.style.fontSize = '16px';
  controlUI.style.paddingLeft = '21px';
  controlUI.style.paddingRight = '21px';
  controlDiv.appendChild(controlUI);

  // // Setup the click event listeners: simply set the map to
  // // Chicago
  // google.maps.event.addDomListener(controlUI, 'click', function() {
  // });
}

function initSpotFixButton(map) {
  // Construct your control in whatever manner is appropriate.
  // Generally, your constructor will want access to the
  // DIV on which you'll attach the control UI to the Map.
  var controlDiv = document.createElement('div');
  var spotfixbutton = new SpotFixControl(controlDiv, map);

  // We don't really need to set an index value here, but
  // this would be how you do it. Note that we set this
  // value as a property of the DIV itself.
  controlDiv.index = 1;

  // Add the control to the map at a designated control position
  // by pushing it on the position's array. This code will
  // implicitly add the control to the DOM, through the Map
  // object. You should not attach the control manually.
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}


function newSpotFix() {
  console.log("new spot fix");
}