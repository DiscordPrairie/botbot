const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.argv.length == 2 ? process.env.token : '';
const welcomeChannelName = "사유지입구";
const byeChannelName = "사유지출구";
const welcomeChannelComment = "어서오세요, 사유지에 오신걸환영합니다";
const byeChannelComment = "안녕히가세요!";

client.on('ready', () => {
  console.log('켰다.');
  client.user.setPresence({ game: { name: '@help' }, status: 'online' })
});

client.on("guildMemberAdd", (member) => {
  const guild = member.guild;
  const newUser = member.user;
  const welcomeChannel = guild.channels.find(channel => channel.name == welcomeChannelName);

  welcomeChannel.send(`<@${newUser.id}> ${welcomeChannelComment}\n`);

  member.addRole(guild.roles.find(role => role.name == "사유지 방문자"));
});

client.on("guildMemberRemove", (member) => {
  const guild = member.guild;
  const deleteUser = member.user;
  const byeChannel = guild.channels.find(channel => channel.name == byeChannelName);

  byeChannel.send(`<@${deleteUser.id}> ${byeChannelComment}\n`);
});

client.on('message', (message) => {
  if(message.author.bot) return;

  if(message.content == '안녕') {
    return message.reply('안녕하세요');
  }

  if(message.content == '@help2') {
    let img = 'https://cdn.discordapp.com/attachments/737597103953543188/744914139931213884/1_25.png';
    let embed = new Discord.RichEmbed()
      .setTitle('로봇 소개')
      .setURL('http://www.naver.com')
      .setAuthor('파이리', img, 'http://www.naver.com')
      .setThumbnail(img)
      .addBlankField()
      .addField('현재 4번째의 봇완성체', '1,2,3번는 고장남,아니면 쓸모가없어짐')
      .addField('파이리님의 디코서버문의제작', '무료로 해드립니다,개발자님한테 디엠주세요', true)
      .addField('파이리님의 핵대리사업', '가격표는 그때알려주겠습니다,디엠주세요', true)
      .addField('로봇를 만든사람들', '파이리812#1482,파이리입니다#1861,파일이#6327', true)
      .addBlankField()
      .setTimestamp()
      .setFooter('로봇 개발자:파이리812#1482', img)

    message.channel.send(embed)
  } else if(message.content == '@help') {
    let helpImg = 'https://cdn.discordapp.com/attachments/737597103953543188/744914139931213884/1_25.png';
    let commandList = [
      {name: 'ping', desc: 'pong'},
      {name: '@help', desc: '로봇의 명령어를 알려줍니다'},
      {name: '@help2', desc: '로봇의 대해 소개를 시켜줍니다'},
      {name: '!전체공지', desc: '서버에있는 사람들에게 DM공지를 보냅니다'},
      {name: '!청소', desc: '대량의 메세지를 보냅니다'},
    ];
    let commandStr = '';
    let embed = new Discord.RichEmbed()
      .setAuthor('로봇 개발자:파이리812#1482', helpImg)
      .setColor('#186de6')
      .setFooter(`로봇사유지 출신`)
      .setTimestamp()
    
    commandList.forEach(x => {
      commandStr += `• \`\`${changeCommandStringLength(`${x.name}`)}\`\` : **${x.desc}**\n`;
    });

    embed.addField('Commands: ', commandStr);

    message.channel.send(embed)
  }

  if(message.content.startsWith('!전체공지')) {
    if(checkPermission(message)) return
    if(message.member != null) { // 채널에서 공지 쓸 때
      let contents = message.content.slice('!전체공지'.length);
      message.member.guild.members.array().forEach(x => {
        if(x.user.bot) return;
        x.user.send(`<@${message.author.id}> ${contents}`);
      });
  
      return message.reply('공지를 전송했습니다.');
    } else {
      return message.reply('채널에서 실행해주세요.');
    }
  }

  if(message.content.startsWith('!청소')) {
    if(checkPermission(message)) return

    var clearLine = message.content.slice('!청소 '.length);
    var isNum = !isNaN(clearLine)

    if(isNum && (clearLine <= 0 || 100 < clearLine)) {
      message.channel.send("1부터 100까지의 숫자만 입력해주세요.")
      return;
    } else if(!isNum) { // c @나긋해 3
      if(message.content.split('<@').length == 2) {
        if(isNaN(message.content.split(' ')[2])) return;

        var user = message.content.split(' ')[1].split('<@!')[1].split('>')[0];
        var count = parseInt(message.content.split(' ')[2])+1;
        const _limit = 10;
        let _cnt = 0;

        message.channel.fetchMessages({limit: _limit}).then(collected => {
          collected.every(msg => {
            if(msg.author.id == user) {
              msg.delete();
              ++_cnt;
            }
            return !(_cnt == count);
          });
        });
      }
    } else {
      message.channel.bulkDelete(parseInt(clearLine)+1)
        .then(() => {
          AutoMsgDelete(message, `<@${message.author.id}> ` + parseInt(clearLine) + "개의 메시지를 삭제했습니다. (이 메세지는 잠시 후에 사라집니다.)");
        })
        .catch(console.error)
    }
  }
});

function checkPermission(message) {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(`<@${message.author.id}> ` + "명령어를 수행할 관리자 권한을 소지하고 있지않습니다.")
    return true;
  } else {
    return false;
  }
}

function changeCommandStringLength(str, limitLen = 8) {
  let tmp = str;
  limitLen -= tmp.length;

  for(let i=0;i<limitLen;i++) {
      tmp += ' ';
  }

  return tmp;
}

async function AutoMsgDelete(message, str, delay = 3000) {
  let msg = await message.channel.send(str);

  setTimeout(() => {
    msg.delete();
  }, delay);
}


client.login(token);