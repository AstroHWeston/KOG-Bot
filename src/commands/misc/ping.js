const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot\'s latency'),
    async execute(interaction) {
        const start = Date.now();
        await interaction.reply('Pinging...');
        const latency = Date.now() - start;
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Pong!')
            .setDescription(`Returned Successfully\nBot Latency: ${latency}ms\nAPI Latency: ${interaction.client.ws.ping}ms`);
        await interaction.followUp({ embeds: [embed] });
    }
};
