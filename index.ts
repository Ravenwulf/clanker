import { Client, Intents } from 'discord.js';

import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

client.on('ready', () => {
    console.log('Bot Online');
});

client.on('messageCreate', (msg) => {
    if(msg.content == 'ping') msg.channel.send({ content: 'pong' });
});

client.login(process.env.TOKEN);