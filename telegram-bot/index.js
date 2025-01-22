require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

// User registration data (you can store this in a database for production)
const registeredUsers = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  if (!registeredUsers[chatId]) {
    registeredUsers[chatId] = true;
    bot.sendMessage(chatId, 'Welcome to the Bouncing Ball Game! You are now registered.');
  } else {
    bot.sendMessage(chatId, 'You are already registered.');
  }

  // Send 'start' command to the server
  const url = 'http://localhost:8080'; 
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ command: 'start' }) 
  })
  .then(response => {
    console.log('Start command sent to server.');
  })
  .catch(error => {
    console.error('Error sending start command to server:', error);
  });
});

bot.onText(/\/stop/, (msg) => {
  const chatId = msg.chat.id;

  if (registeredUsers[chatId]) {
    // Send the 'stop' command to the server
    const url = 'http://localhost:8080'; 
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ command: 'stop' }) 
    })
      .then(response => {
        console.log('Stop command sent to server.');
      })
      .catch(error => {
        console.error('Error sending stop command to server:', error);
      });
  } else {
    bot.sendMessage(chatId, 'Please register first using /start');
  }
});

// Handle other commands (disabled for now)
// bot.onText(/\/(speedup|slowdown|reverse)/, (msg, match) => { 
//   // ... (previous code for handling speedup, slowdown, reverse) ...
// });

console.log('Bot is running...');