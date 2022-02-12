import Discord, { Client, DiscordAPIError, Intents, Interaction } from 'discord.js';

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

    const guildId = '722611356699852933';
    const guild = client.guilds.cache.get(guildId);
    let commands;

    if (guild)
        commands = guild.commands
    else
        commands = client.application?.commands


    commands?.create({
        name: 'ping',
        description: 'Replies With Pong'
    });

    commands?.create({
        name: 'add',
        description: 'Adds two numbers',
        options: [
            {
               name: 'num1',
               description: 'first number',
               required: true,
               type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER,
            },
            {
                name: 'num2',
                description: 'first number',
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER,
            }
        ]
    })
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    switch (commandName) {
        case 'ping':
            interaction.reply({
                content: 'pong',
                ephemeral: true
            })
            break;
        case 'add':
            const num1 = options.getNumber('num1')!;
            const num2 = options.getNumber('num2')!;

            await interaction.deferReply({
                ephemeral: true
            })

            // simulate 5 second delay
            await new Promise(resolve => setTimeout(resolve, 5000));

            await interaction.editReply({
                content: `Sum: ${num1+num2}`,
            });
            break;
    }
})

client.login(process.env.TOKEN);