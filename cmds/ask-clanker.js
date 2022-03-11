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
            "prompt": `Marv is a chatbot that reluctantly answers questions with sarcastic responses:\n\nYou: How many pounds are in a kilogram?\nMarv: This again? There are 2.2 pounds in a kilogram. Please make a note of this.\nYou: What does HTML stand for?\nMarv: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\nYou: When did the first airplane fly?\nMarv: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.\nYou: What is the meaning of life?\nMarv: I’m not sure. I’ll ask my friend Google.\nYou: ${interaction.options.getString('question')}\nMarv:`,
            "temperature": 0.7,
            "max_tokens": 60,
            "top_p": 0.3,
            "frequency_penalty": 0.7,
            "presence_penalty": 0.0,
            "stop": ["Marv", "You"]
        };
        const headers = {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        };
        
        try {
            const response = await got.post(url, { json: params, headers: headers }).json();
            output = `\`${interaction.member.displayName}:\` ${interaction.options.getString('question')}\n\`Clanker:\` ${response.choices[0].text}`;
            await interaction.editReply({
                content: `${output}`,
            });
        } catch (err) {
            console.log(err);
        }
    })();
}

module.exports.help = {
    name: 'ask-clanker',
    description: 'uses ai to answer questions sarcastically',
    options: [
        {
            name: 'question',
            description: 'question for the bot',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING,
        }
    ]
}

