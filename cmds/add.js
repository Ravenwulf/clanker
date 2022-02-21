const { Constants } = require('discord.js');

module.exports.run = async (bot, interaction) => {
    const num1 = interaction.options.getNumber('num1');
    const num2 = interaction.options.getNumber('num2');

    await interaction.deferReply({
        ephemeral: true
    })

    // simulate 5 second delay
    // await new Promise(resolve => setTimeout(resolve, 5000));

    await interaction.editReply({
        content: `Sum: ${num1+num2}`,
    });
}

module.exports.help = {
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
}