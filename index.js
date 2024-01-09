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

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!연말정산')) {
    // JSON 데이터 생성
    const jsonData = {
      username: message.author.username,
      userID: message.author.id,
      messageContent: message.content.substring(6), 
    };

    console.log(jsonData);

    jsonChannel.startTyping();

    const apiEndpoint = process.env.API_ENDPOINT; 

    console.log(apiEndpoint);

    try {
      const response = await axios.post(apiEndpoint, jsonData);

      console.log(response);

      const jsonChannel = message.guild.channels.cache.find(
        (channel) => channel.name === '연말정산도우미' 
      );

      console.log(jsonChannel);

      if (!jsonChannel) {
        message.reply('JSON 채널을 찾을 수 없습니다.');
        jsonChannel.stopTyping();
        return;
      }

      jsonChannel.send('API 응답:', {
        embed: {
          description: '```json\n' + JSON.stringify(response.data, null, 2) + '\n```',
        },
      });

      console.log(response.data);

      jsonChannel.stopTyping();
    } catch (error) {
      console.error('Error sending request to API:', error);
      message.reply('API 요청 중 오류가 발생했습니다.');
      jsonChannel.stopTyping();
    }
  }
});

// client.login(process.env.DISCORD_BOT_TOKEN);
discordLogin();