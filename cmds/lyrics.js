const { Constants } = require('discord.js');
const got = require('got');
const dotenv = require('dotenv');
dotenv.config();

module.exports.run = async (bot, interaction) => {
    const prompt = `Artist: ${interaction.options.getString('artist')}\n\nLyrics:\n`;
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
}

module.exports.help = {
    name: 'lyrics',
    description: 'uses ai to generate lyrics',
    options: [
        {
            name: 'artist',
            description: 'band or artist',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING,
        }
    ]
}

