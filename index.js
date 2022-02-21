const { Constants, Client, DiscordAPIError, Intents, Interaction, Collection } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
// const prompt = `Artist: Megadeth\n\nLyrics:\n`;

// import  { Configuration, OpenAIApi } from "openai";
// const configuration = new Configuration({
//     organization: "org-s9Bd627OlphIc8SCSU9MgYHO",
//     apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();



const bot = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

bot.commands = new Collection();

fs.readdir("./cmds/", (err, files) => {
    if(err) console.log(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0) {
        console.log("No commands to load!");
        return;
    }

    console.log(`Loading ${jsfiles.length} commands!`);

    jsfiles.forEach((f, i) => {
        let props = require(`./cmds/${f}`);
        console.log(`${i + 1}: ${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });
});

bot.on('ready', () => {
    console.log(`${bot.user.username} is online!`);
    // console.log(bot.commands);

    const guildId = '722611356699852933';
    const guild = bot.guilds.cache.get(guildId);
    let cmdChannel;

    if (guild)
        cmdChannel = guild.commands
    else
        cmdChannel = bot.application?.commands

    bot.commands.forEach(cmd => {
        cmdChannel?.create({
            name: cmd.help.name,
            description: cmd.help.description,
            options: cmd.help.options
        });
    });

});

bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    let command = bot.commands.get(commandName);
    if(command) command.run(bot, interaction);
})

bot.login(process.env.TOKEN);