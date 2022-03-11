const { Constants } = require('discord.js');
const got = require('got');
const dotenv = require('dotenv');
dotenv.config();

module.exports.run = async (bot, interaction) => {
    console.log(interaction.options.getString('title'));
    await interaction.deferReply();

    (async () => {
        const url = 'https://api.openai.com/v1/engines/davinci/completions';
        const params = {
            "prompt": `Convert movie titles into emoji.\n\nBack to the Future: 👨👴🚗🕒 \nBatman: 🤵🦇 \nTransformers: 🚗🤖 \n${interaction.options.getString('title')}:`,
            "temperature": 0.5,
            "max_tokens": 60,
            "top_p": 0.9,
            "frequency_penalty": 0.7,
            "presence_penalty": 0.0,
            "stop": ["\n"],
        };
        const headers = {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        };
        
        try {
            const response = await got.post(url, { json: params, headers: headers }).json();
            output = `\`${interaction.member.displayName}:\` ${interaction.options.getString('title')}\n\`Clanker:\` ${response.choices[0].text}`;
            await interaction.editReply({
                content: `${output}`,
            });
        } catch (err) {
            console.log(err);
        }
    })();
}

module.exports.help = {
    name: 'movie-emojify',
    description: 'uses ai to convert a movie title into emojis',
    options: [
        {
            name: 'title',
            description: 'title of movie to be converted',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING,
        }
    ]
}

