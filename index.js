const Discord = require('discord.js');
const axios = require('axios'); 

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
    ],
});

const sleep = (ms) => {
    return new Promise((r) => setTimeout(r, ms));
}

if (process.env.DISCORD_BOT_TOKEN == null) {
    console.log("An discord token is empty.");
    sleep(60000).then(() => console.log("Service is getting stopped automatically"));
}

const discordLogin = async () => {
    try {
        await client.login(process.env.DISCORD_BOT_TOKEN);
    } catch (TOKEN_INVALID) {
        console.log("An invalid token was provided");
        sleep(60000).then(() => console.log("Service is getting stopped automatically"));
    }
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!sendjson')) {
    // JSON 데이터 생성
    const jsonData = {
      username: message.author.username,
      userID: message.author.id,
      messageContent: message.content.substring(10), 
    };

    message.channel.startTyping();

    const apiEndpoint = process.env.API_ENDPOINT; // 실제 API endpoint URL로 변경

    try {
      const response = await axios.post(apiEndpoint, jsonData);

      const jsonChannel = message.guild.channels.cache.find(
        (channel) => channel.name === 'json-channel' // 채널 이름으로 변경
      );
      if (!jsonChannel) {
        message.reply('JSON 채널을 찾을 수 없습니다.');
        message.channel.stopTyping();
        return;
      }

      jsonChannel.send('API 응답:', {
        embed: {
          description: '```json\n' + JSON.stringify(response.data, null, 2) + '\n```',
        },
      });

      message.channel.stopTyping();
    } catch (error) {
      console.error('Error sending request to API:', error);
      message.reply('API 요청 중 오류가 발생했습니다.');
      message.channel.stopTyping();
    }
  }
});

// client.login(process.env.DISCORD_BOT_TOKEN);
discordLogin();