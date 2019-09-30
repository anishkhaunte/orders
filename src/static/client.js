document.addEventListener("DOMContentLoaded", function() {
   var mouse = { 
      click: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: false
   };
   // get canvas element and create context
   var canvas  = document.getElementById('drawing');
   var context = canvas.getContext('2d');
   var width   = window.innerWidth;
   var height  = window.innerHeight;
   var socket  = io.connect();

   // set canvas to full browser width/height
   canvas.width = width;
   canvas.height = height;

   // register mouse event handlers
   //if(localStorage.getItem("access") == 1){
    canvas.onmousedown = function(e){ mouse.click = true; };
    canvas.onmouseup = function(e){ mouse.click = false; };

    canvas.onmousemove = function(e) {
        // normalize mouse position to range 0.0 - 1.0
        mouse.pos.x = e.clientX / width;
        mouse.pos.y = e.clientY / height;
        mouse.move = true;
    }; 
   //} else {
    //console.log('No access')
   //}
   

   // draw line received from server
	socket.on('draw_line', function (data) {
      console.log('Line received in FE')
      var line = data.line;
      context.beginPath();
      context.moveTo(line[0].x * width, line[0].y * height);
      context.lineTo(line[1].x * width, line[1].y * height);
      context.stroke();
   });
   
   // main loop, running every 25ms
   function mainLoop() {
      // check if the user is drawing
      if (mouse.click && mouse.move && mouse.pos_prev) {
         // send line to to the server
         socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ] });
         mouse.move = false;
      }
      mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
      setTimeout(mainLoop, 25);

   }

   function checkLocalStorage() {
      if(localStorage) {
         console.log('Local storage present')
         //if(data){
           // console.log('data present in local storage')
            //console.log('get user details')
         //} else {
           // console.log('data not present in local storage')
            //console.log('create user')
         //}
         user.getUserList().then(function(res){
          return res;
         }).then(function(res){
          if(res.data.length === 0){
            console.log('create an admin')
            return user.createUser(1)
          }else {
            console.log('create a normal user')
            return user.createUser(2)
          }
         }).then(function(user){
            console.log('saved user')
            console.log(user)
            appLocalStorage.setLocalStorage(user)
            if(user.data.user.role == 1){
              console.log('Show erase and erase all')
              showErase()
            }
         })
      } else {
         console.log('Local storage not present')
      }
   }

   function request (){
      console.log('Request accepted')
   }

   
   mainLoop();
   checkLocalStorage();
});

function showErase () {
  console.log('inside show erase')
  document.getElementById('eraser').style.display = 'block';
  document.getElementById('eraserall').style.display = 'block';
  document.getElementById("eraser").addEventListener("click", eraser);
  document.getElementById("eraserall").addEventListener("click", eraserall);
}

function myFunction() {
    console.log('request access');
    // Get userid from local storage and send for request access
    let user = appLocalStorage.getLocalStorage()
    if(user && user.id && user.role!=1){
      userrequest.requestAccess(user.id).then(function(userrequest){
        return userrequest
      }).then(function(userrequest){
        console.log('the userrequest')
        console.log(userrequest)
      })  
    }    
}

function myApprove() {
    console.log('approve access');
    // Get userid from local storage and send for request access
    let user = appLocalStorage.getLocalStorage()
    if(user && user.id && user.role!=1){
      userrequest.approveRequest(user.id).then(function(userrequest){
        return userrequest
      }).then(function(userrequest){
        console.log('the userrequest')
        console.log(userrequest)
      })  
    }    
}

function myNotification () {
  console.log('inside notifications')
  console.log('get any pending requetss')
  $.ajax({
     type: 'GET',
     url: rootURL + '/' + id,
     dataType: "json",
     success: function(data){
           //$('#btnDelete').show();
           //renderDetails(data);
           console.log('Populate user details')
     }
  });
}

//Only admin sees the below functions
function eraser(){                 
    var canvas  = document.getElementById('drawing');
    var context = canvas.getContext('2d');             
    context.strokeStyle = "rgb(255, 255, 255)";
    context.globalCompositeOperation = "destination-out";  
    context.strokeStyle = ("rgba(255,255,255,255)");
    /* or */
    context.fillStyle = "rgba(255,0,0,0)";
}

function eraserall(){                 
    var canvas  = document.getElementById('drawing');
    var context = canvas.getContext('2d');  
    context.clearRect(0, 0, canvas.width, canvas.height);
           
}