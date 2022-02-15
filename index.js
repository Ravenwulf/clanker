const { Constants, Client, DiscordAPIError, Intents, Interaction } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const got = require('got');
// const prompt = `Artist: Megadeth\n\nLyrics:\n`;

// import  { Configuration, OpenAIApi } from "openai";
// const configuration = new Configuration({
//     organization: "org-s9Bd627OlphIc8SCSU9MgYHO",
//     apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();



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
               type: Constants.ApplicationCommandOptionTypes.NUMBER,
            },
            {
                name: 'num2',
                description: 'first number',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.NUMBER,
            }
        ]
    });

    commands?.create({
        name: 'ai',
        description: 'uses ai to generate lyrics',
        options: [
            {
               name: 'artist',
               description: 'band or artist',
               required: true,
               type: Constants.ApplicationCommandOptionTypes.STRING,
            }
        ]
    });

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
            const num1 = options.getNumber('num1');
            const num2 = options.getNumber('num2');

            await interaction.deferReply({
                ephemeral: true
            })

            // simulate 5 second delay
            // await new Promise(resolve => setTimeout(resolve, 5000));

            await interaction.editReply({
                content: `Sum: ${num1+num2}`,
            });
            break;
        case 'ai':
            const prompt = `Artist: ${options.getString('artist')}\n\nLyrics:\n`;
            console.log(prompt);
            await interaction.deferReply();

            (async () => {
                const url = 'https://api.openai.com/v1/engines/davinci/completions';
                const params = {
                    "prompt": prompt,
                    "max_tokens": 160,
                    "temperature": 0.7,
                    "frequency_penalty": 0.7
                };
                const headers = {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                };
                
                try {
                    const response = await got.post(url, { json: params, headers: headers }).json();
                    output = `${prompt}${response.choices[0].text}`;
                    await interaction.editReply({
                        content: `${output}`,
                    });
                } catch (err) {
                    console.log(err);
                }
            })();
            break;
    }
})

client.login(process.env.TOKEN);