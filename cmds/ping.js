module.exports.run = async (bot, interaction) => {
    interaction.reply({
        content: 'pong',
        ephemeral: true
    })
}

module.exports.help = {
    name: 'ping',
    description: 'Replies With Pong'
}