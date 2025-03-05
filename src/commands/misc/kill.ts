/*const { SlashCommandBuilder, EmbedBuilder } = import("discord.js"); // async is a stinky and made me use import require on top all im saying
const config = ("../../config.toml")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kill')
        .setDescription("Kill a user (in messages)."),
            .addUserOption(option =>
                option.setName('user')
                   .setDescription('The user to kill.')
                   .setRequired(true)
            )
    },
    async execute(interaction) {

    const user = interaction.getUser();
        const embed = new EmbedBuilder()
            .setColor(config.embedColors)
            .setTitle('Killed')
            .setDescription(`I have killed the stinky of <@{user.id}>`);
        await interaction.reply({ embeds: [embed] });
    }
};
*/