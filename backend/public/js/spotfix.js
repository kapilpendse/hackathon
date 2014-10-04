
var CONSTANTS = {};
CONSTANTS.SPECTATOR = "SPECTATOR";
CONSTANTS.DOER = "DOER";
CONSTANTS.PLANNER = "PLANNER";

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
  controlDiv.style.padding = '20px';

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

function initSpotFixPhotoSlider(parentSelector, photos) {
    $(parentSelector).empty();
    var baseUrl = "/api/spotfix/getphoto/";
    var active = document.createElement('div');
    active.className = "m-item m-active";
    var activeImg = document.createElement('img');
    activeImg.setAttribute("src", baseUrl + photos[0]);
    activeImg.setAttribute("max-width", "100%");
    active.appendChild(activeImg);
    $(parentSelector).append(active);
    for(var i=1; i<photos.length; i++) {
        var item = document.createElement('div');
        item.className = "m-item";
        var itemImg = document.createElement('img');
        itemImg.setAttribute("src", baseUrl + photos[i]);
        itemImg.setAttribute("max-width", "100%");
        item.appendChild(itemImg);
        $(parentSelector).append(item);
    }
    $('#info-photos-slider').scooch();
}

function joinSpotFix(spotfixId) {
}

function loadSpotFixInfoButtons(role, onDone) {
    var row = $('<div></div>');
    row.attr("class", "row");
    if(role == CONSTANTS.SPECTATOR) {
        var emptyLeft = $('<div></div>');
        emptyLeft.attr("class", "small-4 medium-5 large-5 columns empty-column");
        row.append(emptyLeft);
        var join = $('<a></a>');//document.createElement('a');
        join.attr("class", "small-4 medium-2 large-2 columns button round"); //join.className = "small-4 medium-2 large-2 columns button round";
        join.attr("id", "sf-join"); //join.id = "sf-join";
        join.html("Join");//join.innerHTML = "Join";
        join.click(function (event) {
            console.log("Join");
        });
        row.append(join);
        var emptyRight = $('<div></div>');
        emptyRight.attr("class", "small-4 medium-5 large-5 columns empty-column");
        row.append(emptyRight);
    } else if(role == CONSTANTS.PLANNER) {
        var emptyLeft = $('<div></div>');
        emptyLeft.attr("class", "small-1 medium-2 large-2 columns empty-column");
        row.append(emptyLeft);
//        var buttonBar = $('<div></div>');
//        buttonBar.attr("class", "button-bar");
        var middle = $('<div></div>');
        middle.attr("class", "small-10 medium-8 large-8 columns");
        var buttonGroup = $('<ul></ul>');
        buttonGroup.attr("class", "small-block-grid-1 medium-block-grid-2 large-block-grid-4 even-4");
        buttonGroup.append('<li><a href="#" class="button round" id="sf-unjoin">Unjoin</a></li>');
        buttonGroup.append('<li><a href="#" class="button round" id="sf-mark-complete">Complete</a></li>');
        buttonGroup.append('<li><a href="#" class="button round" id="sf-edit">Edit</a></li>');
        buttonGroup.append('<li><a href="#" class="button round" id="sf-checkin">Check In</a></li>');
        $('#sf-unjoin').click(function (event) {
            console.log("Unjoin");
        });
        $('#sf-mark-complete').click(function (event) {
            console.log("Mark Complete");
        });
        $('#sf-edit').click(function (event) {
            console.log("Edit");
        });
        middle.append(buttonGroup);
        row.append(middle);
        var emptyRight = $('<div></div>');
        emptyRight.attr("class", "small-1 medium-2 large-2 columns empty-column");
        row.append(emptyRight);
    }

    var closeBtn = document.createElement('a');
    closeBtn.className = "close-reveal-modal";
    closeBtn.innerHTML = "&#215;";
    var sfOptions = $("#sf-options");
    sfOptions.empty();
    sfOptions.append(row);
    sfOptions.append(closeBtn);
    var sfInfoModal = $("#sf-info-modal");
    sfInfoModal.remove("#sf-options");
    sfInfoModal.append(sfOptions);

    if(onDone) {
        onDone();
    }
}

function newSpotFix(where, description, date, time, latitude, longitude, photoid) {
  console.log("new spot fix");
  var ddMMyyyy = date.split("/");
  if(ddMMyyyy.length == 1) {
      ddMMyyyy = date.split("-");
  }
  var dd = ddMMyyyy[0];
  var MM = ddMMyyyy[1];
  var yyyy = ddMMyyyy[2];
  var HHmm = time.split(":");
  var HH = HHmm[0];
  var mm = HHmm[1];

  var params = {};
  params.where = where;
  params.description = description;
  params.date = dd + "/" + MM + "/" + yyyy + " " + HH + ":" + mm;
  params.latitude = latitude;
  params.longitude = longitude;
  params.photoid = photoid;
  $.ajax({
    url: "/api/spotfix/newplan",
    type: "POST",
    data: params,
    success: function(data, textStatus, jqXHR) {
      //data - response from server
      console.log("xhr success");
      if(data.result == "ok") {
//          window.location.replace("/")
        location.reload(true);
      } else {
        console.log("signup failed " + data.reason);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log("xhr error");
    }
  })
}

function signup(name, email, password) {
  console.log("signup");
  var params = {};
  params.name = name;
  params.email = email;
  params.password = password;
  $.ajax({
    url: "/api/person/signup",
    type: "POST",
    data: params,
    success: function(data, textStatus, jqXHR) {
      //data - response from server
      console.log("xhr success");
      if(data.result == "ok") {
//          window.location.replace("/")
        location.reload(true);
      } else {
        console.log("signup failed " + data.reason);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log("xhr error");
    }
  })
}

function login(email, password) {
  console.log("login");
  var params = {};
  params.email = email;
  params.password = password;
  $.ajax({
    url: "/api/person/login",
    type: "POST",
    data: params,
    success: function(data, textStatus, jqXHR) {
      //data - response from server
      console.log("xhr success");
      if(data.result == "ok") {
//          window.location.replace("/")
        location.reload(true);
      } else {
        console.log("invalid credentials");
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log("xhr error");
    }
  })
}

function logout() {
  console.log("Logout");
  var params = {};
  $.ajax({
    url: "/api/person/logout",
    type: "POST",
    data: params,
    success: function(data, textStatus, jqXHR) {
      //data - response from server
      console.log("xhr success");
      if(data.result == "ok") {
        location.reload(true);
      } else {
        console.log("logout failed!");
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log("xhr error");
    }
  })
}