var clock = document.getElementById('clock');

var updateClock = function(){
  fetch('/time.json')
    .then(function(response){
      return response.json();
    })
    .then(function(json){
      clock.innerText = new Date(Number(json.now));
    });
};

var setUpForm = function(){
  var status = document.getElementById('status');
  var form = document.getElementById('myForm');

  form.onsubmit = function(e){
    e.preventDefault();
    status.innerText = status.className = '';

    fetch('/message', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: new FormData(form).get('message') })
    }).then(function(response){
      return response.json();
    }).then(function(result){
      status.className = result.status;
      status.innerText = result.message;
    });
  }
};

var setUpSocket = function(){
  var socket = io();

  var form = document.getElementById('webSocketForm');
  form.onsubmit = function(e){
    e.preventDefault();
    socket.emit('chat message', new FormData(form).get('message'));
    form.reset();
  };

  var chat = document.getElementById('chat');
  socket.on('chat message', function(msg){
    var li = document.createElement('li');
    li.innerText = msg;
    chat.appendChild(li);
  });
};

window.onload = function(){
  setInterval(updateClock, 1000);
  setUpForm();
  setUpSocket();
};
