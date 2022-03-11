const { Constants } = require('discord.js');
const got = require('got');
const dotenv = require('dotenv');
dotenv.config();

module.exports.run = async (bot, interaction) => {
    console.log(interaction.options.getString('message'));
    await interaction.deferReply();

    (async () => {
        const url = 'https://api.openai.com/v1/engines/davinci/completions';
        const params = {
            "prompt": `Transcript of a conversation between you and ${interaction.options.getString('character')}:\n\nYou: ${interaction.options.getString('message')}\n${interaction.options.getString('character')}: `,
            "temperature": 0.5,
            "max_tokens": 60,
            "top_p": 0.3,
            "frequency_penalty": 0.5,
            "presence_penalty": 0.0,
            "stop": ["You:"]
        };
        const headers = {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        };
        
        try {
            const response = await got.post(url, { json: params, headers: headers }).json();
            output = `\`${interaction.member.displayName}:\` ${interaction.options.getString('message')}\n\`${interaction.options.getString('character')}:\` ${response.choices[0].text}`;
            await interaction.editReply({
                content: `${output}`,
            });
        } catch (err) {
            console.log(err);
        }
    })();
}

module.exports.help = {
    name: 'reply-as',
    description: 'uses ai to respond to messages as different characters',
    options: [
        {
            name: 'message',
            description: 'message for the bot to reply to',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING,
        },
        {
            name: 'character',
            description: 'character for the bot to reply as',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING,
        },
        // {
        //     name: 'mean',
        //     description: 'should the bot try to be mean?',
        //     required: true,
        //     type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
        // },
    ]
}

