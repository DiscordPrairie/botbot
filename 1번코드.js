const Discord = require('discord.js');
const client = new Discord.Client();
const token = 'NzQ3MzAwMDE0NjE4ODM3MDQy.X0M3Xw.IBE-VjrtepDtfxrKpDkVfaPMLWA';

client.on('ready', () => {
  console.log('켰다.');
});

client.on('message', (message) => {
  if(message.content === 'ping') {
    message.reply('pong');
  }
});

client.login(token);