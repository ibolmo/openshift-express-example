/* global fetch document io FormData window */

const clock = document.getElementById('clock');

function updateClock() {
  fetch('/time.json')
    .then((response) => response.json())
    .then((json) => {
      clock.innerText = new Date(Number(json.now));
    });
}

function setUpForm() {
  const status = document.getElementById('status');
  const form = document.getElementById('myForm');

  form.onsubmit = (e) => {
    e.preventDefault();
    status.innerText = status.className = '';

    fetch('/message', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: new FormData(form).get('message') }),
    })
    .then((response) => response.json())
    .then((result) => {
      status.className = result.status;
      status.innerText = result.message;
    });
  };
}

function setUpSocket() {
  const socket = io();
  const form = document.getElementById('webSocketForm');
  form.onsubmit = (e) => {
    e.preventDefault();
    socket.emit('chat message', new FormData(form).get('message'));
    form.reset();
  };

  const chat = document.getElementById('chat');
  socket.on('chat message', (msg) => {
    const li = document.createElement('li');
    li.innerText = msg;
    chat.appendChild(li);
  });
}

window.onload = () => {
  setInterval(updateClock, 1000);
  setUpForm();
  setUpSocket();
};
