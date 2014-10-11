
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

function loadSpotFixInfoButtons(spotfixId, role, onDone) {
    console.log("role is " + role);
    var row = $('<div></div>');
    row.attr("class", "row");

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

    var emptyLeft = $('<div></div>');
    emptyLeft.attr("class", "small-2 medium-3 large-3 columns empty-column");
    var middle = $('<div></div>');
    middle.attr("class", "small-8 medium-6 large-6 columns");
    var buttonGroup = $('<ul></ul>');
    var emptyRight = $('<div></div>');
    emptyRight.attr("class", "small-2 medium-3 large-3 columns empty-column");
//    if(role == CONSTANTS.DOER) {
    if(role == CONSTANTS.SPECTATOR) {
        row.append(emptyLeft);
        buttonGroup.attr("class", "small-block-grid-1 medium-block-grid-1 large-block-grid-1");
        buttonGroup.append('<li><a href="#" class="button" id="sf-join">Join</a></li>');
        middle.append(buttonGroup);
        row.append(middle);
        row.append(emptyRight);
        $('#sf-join').click(function (event) {
            console.log("Join");
            var button = $('#sf-join');
            button.html("Joining...");
            button.attr("class", "button disabled");
            joinSpotFix(spotfixId, function(result) {
                if(result == "success") {
                    button.attr("class", "button");
                    button.html("Joined!");
                    setTimeout(function() {
                        location.reload(true);
                    }, 500);
                } else {
                    button.html("Error");
                    setTimeout(function() {
                        button.attr("class", "button");
                        button.html("Join");
                    }, 500);
                }
            });
        });
//    } else if(role == CONSTANTS.SPECTATOR) {
    } else if(role == CONSTANTS.DOER) {
//        row.append(emptyLeft);
//        buttonGroup.attr("class", "small-block-grid-1 medium-block-grid-2 large-block-grid-2");
//        buttonGroup.append('<li><a href="#" class="button" id="sf-leave">Leave</a></li>');
//        buttonGroup.append('<li><a href="#" data-reveal-id="sf-add-photos-modal" class="button" id="sf-add-photos">Add Photos</a></li>');
//        middle.append(buttonGroup);
//        row.append(middle);
//        row.append(emptyRight);
        buttonGroup.attr("class", "small-12 medium-8 large-5 small-centered columns button-group even-2");
        buttonGroup.append('<li><a href="#" class="button" id="sf-leave">Leave</a></li>');
        buttonGroup.append('<li><a href="#" data-reveal-id="sf-add-photos-modal" class="button" id="sf-add-photos">Add Photos</a></li>');
        row.append(buttonGroup);
        $('#sf-add-photos').attr("spotfix-id", spotfixId);
        $('#sf-leave').click(function (event) {
            console.log("Leave");
            var button = $('#sf-leave');
            button.html("Leaving...");
            button.attr("class", "button disabled");
            leaveSpotFix(spotfixId, function(result) {
                if(result == "success") {
                    button.attr("class", "button");
                    button.html("Left.");
                    setTimeout(function() {
                        location.reload(true);
                    }, 500);
                } else {
                    button.html("Error");
                    setTimeout(function() {
                        button.attr("class", "button");
                        button.html("Leave");
                    }, 500);
                }
            });
        });

//    } else if(role == CONSTANTS.DOER) {
    } else if(role == CONSTANTS.PLANNER) {
//        row.append(emptyLeft);
//        buttonGroup.attr("class", "small-block-grid-1 medium-block-grid-2 large-block-grid-4");
//        buttonGroup.append('<li><a href="#" data-reveal-id="sf-add-photos-modal" class="button" id="sf-add-photos">Add Photos</a></li>');
//        buttonGroup.append('<li><a href="#" class="button" id="sf-edit">Edit</a></li>');
//        buttonGroup.append('<li><a href="#" class="button" id="sf-mark-complete">Complete</a></li>');
//        buttonGroup.append('<li><a href="#" class="button alert" id="sf-cancel">Cancel</a></li>');
//        middle.append(buttonGroup);
//        row.append(middle);
//        row.append(emptyRight);
        buttonGroup.attr("class", "small-12 medium-10 large-8 small-centered columns button-group even-2");
        buttonGroup.append('<li><a href="#" data-reveal-id="sf-add-photos-modal" class="button" id="sf-add-photos">Add Photos</a></li>');
        buttonGroup.append('<li><a href="#" class="button" id="sf-edit">Edit</a></li>');
        buttonGroup.append('<li><a href="#" class="button" id="sf-mark-complete">Complete</a></li>');
        buttonGroup.append('<li><a href="#" class="button alert" id="sf-cancel">Cancel</a></li>');
        row.append(buttonGroup);
        $('#sf-add-photos').attr("spotfix-id", spotfixId);
        $('#sf-edit').click(function (event) {
            console.log("Edit");
        });
        $('#sf-mark-complete').click(function (event) {
            console.log("Mark Complete");
        });
        $('#sf-cancel').click(function (event) {
            console.log("Cancel SpotFix");
        });
    }

    if(onDone) {
        onDone();
    }
}

function loadSpotFixParticipantsList(participants, onDone) {
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

function joinSpotFix(spotfixId, onDone) {
  var params = {};
  params.spotfixId = spotfixId;
  $.ajax({
    url: "/api/spotfix/join",
    type: "POST",
    data: params,
    success: function(data, textStatus, jqXHR) {
      //data - response from server
      console.log("xhr success");
      if(data.result == "ok") {
        onDone("success");
      } else {
        console.log("signup failed " + data.reason);
        onDone("error");
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log("xhr error");
      onDone("error");
    }
  })
}

function leaveSpotFix(spotfixId, onDone) {
  var params = {};
  params.spotfixId = spotfixId;
  $.ajax({
    url: "/api/spotfix/leave",
    type: "POST",
    data: params,
    success: function(data, textStatus, jqXHR) {
      //data - response from server
      console.log("xhr success");
      if(data.result == "ok") {
        onDone("success");
      } else {
        console.log("signup failed " + data.reason);
        onDone("error");
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log("xhr error");
      onDone("error");
    }
  })
}

function addPhotoToSpotFix(spotfixId, photoId, onDone) {
  var params = {};
  params.spotfixId = spotfixId;
  params.photoid = photoId;
  $.ajax({
    url: "/api/spotfix/addphoto",
    type: "POST",
    data: params,
    success: function(data, textStatus, jqXHR) {
      //data - response from server
      console.log("xhr success");
      if(data.result == "ok") {
        onDone("success");
      } else {
        console.log("signup failed " + data.reason);
        onDone("error");
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log("xhr error");
      onDone("error");
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