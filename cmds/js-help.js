const { Constants } = require('discord.js');
const got = require('got');
const dotenv = require('dotenv');
dotenv.config();

module.exports.run = async (bot, interaction) => {
    console.log(interaction.options.getString('question'));
    await interaction.deferReply();

    (async () => {
        const url = 'https://api.openai.com/v1/engines/davinci/completions';
        const params = {
            "prompt": `You: How do I combine arrays?\nJavaScript chatbot: You can use the concat() method.\nYou: ${interaction.options.getString('question')}\nJavaScript chatbot:`,
            "temperature": 0,
            "max_tokens": 60,
            "top_p": 1.0,
            "frequency_penalty": 0.5,
            "presence_penalty": 0.0,
            "stop": ["You:"],
        };
        const headers = {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        };
        
        try {
            const response = await got.post(url, { json: params, headers: headers }).json();
            output = `\`You:\` ${interaction.options.getString('question')}\n\`JavaScript ChatBot:\` ${response.choices[0].text}`;
            await interaction.editReply({
                content: `${output}`,
            });
        } catch (err) {
            console.log(err);
        }
    })();
}

module.exports.help = {
    name: 'js-help',
    description: 'uses ai to answer questions about javascript',
    options: [
        {
            name: 'question',
            description: 'question for the js chat bot',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING,
        }
    ]
}

