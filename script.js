const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const ws = new WebSocket('ws://localhost:8080'); // Create WebSocket connection

ws.onopen = () => {
  console.log('WebSocket connection opened');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const command = data.command;

  if (command === 'start') {
    isRunning = true;
    if (!animationId) {
      animationId = setInterval(draw, 10);
    }
  } else if (command === 'stop') {
    isRunning = false;
    clearInterval(animationId);
    animationId = null;
  } else if (command === 'speedup') {
    dx *= 1.1;
    dy *= 1.1;
  } else if (command === 'slowdown') {
    dx *= 0.9;
    dy *= 0.9;
  } else if (command === 'reverse') {
    dx = -dx;
    dy = -dy;
  }
};

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let isRunning = false;

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const speedUpBtn = document.getElementById('speedUpBtn');
const slowDownBtn = document.getElementById('slowDownBtn');
const reverseBtn = document.getElementById('reverseBtn');

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fillStyle = "#6C3428";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  if (isRunning) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();

    x += dx;
    y += dy;

    // Bounce off walls
    if (x + dx > canvas.width - 10 || x + dx < 10) {
      dx = -dx;
    }
    if (y + dy > canvas.height - 10 || y + dy < 10) {
      dy = -dy;
    }
  }
}

// Event listeners for buttons (optional, can be removed)
startBtn.addEventListener('click', () => {
  isRunning = true;
  if (!animationId) {
    animationId = setInterval(draw, 10);
  }
  ws.send(JSON.stringify({ command: 'start' }));
});

stopBtn.addEventListener('click', () => {
  isRunning = false;
  clearInterval(animationId);
  animationId = null;
  ws.send(JSON.stringify({ command: 'stop' }));
});

// Speed up, slow down, and reverse buttons can be left empty or removed
// as they are now controlled by Telegram bot commands.

speedUpBtn.addEventListener('click', () => {
  // Optional: Can be left empty as speedup is handled via Telegram bot.
  // ws.send(JSON.stringify({ command: 'speedup' }));
});

slowDownBtn.addEventListener('click', () => {
  // Optional: Can be left empty as slowdown is handled via Telegram bot.
  // ws.send(JSON.stringify({ command: 'slowdown' }));
});

reverseBtn.addEventListener('click', () => {
  // Optional: Can be left empty as reverse is handled via Telegram bot.
  // ws.send(JSON.stringify({ command: 'reverse' }));
});

let animationId = null;
draw();