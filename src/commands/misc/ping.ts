/*const { SlashCommandBuilder, EmbedBuilder } = import("discord.js"); // async is a stinky and made me use import require on top all im saying
const config = ("../../config.toml")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Check the bot's latency"),
    async execute(interaction) {
        const start = Date.now();
        await interaction.reply('Pinging...');
        const latency = Date.now() - start;
        const embed = new EmbedBuilder()
            .setColor(config.embedColors)
            .setTitle('Pong!')
            .setDescription(`Returned Successfully\nBot Latency: ${latency}ms\nAPI Latency: ${interaction.client.ws.ping}ms`);
        await interaction.followUp({ embeds: [embed] });
    }
};
*/