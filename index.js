const Discord = require('discord.js');

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

    const userQuestion = message.content.slice(6).trim();

    const data = {
        question: userQuestion,
    };

    try {
        const apiResponse = await query(data);
        const apiObject = JSON.parse(apiResponse)

        message.channel.send(`연말정산봇: ${apiObject.text}`);
    } catch (error) {
        console.error('Error occurred:', error);
        message.channel.send('Error occurred while processing your request.');
    }
  }
});

async function query(data) {
    const apiEndpoint = process.env.API_ENDPOINT; 
    const response = await fetch(
        apiEndpoint,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();
    return result;
}

// client.login(process.env.DISCORD_BOT_TOKEN);
discordLogin();