import { EmbedBuilder, ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandUserOption, SlashCommandSubcommandBuilder } from "discord.js";
import { KOGBot } from "../../index.js";

class KillCommand implements SlashCommand {
    data = new SlashCommandBuilder()
    .setName('kill')
    .setDescription('Kill a user.')
    dev = true;
    kogBot: KOGBot;

    constructor(kogBot: KOGBot) {
        this.kogBot = kogBot;
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            const user = interaction.options.getUser('user');
            if (!user) {
                interaction.reply("No user was mentioned. Please mention a user to kill.");
                return;
            }

            const embed = new EmbedBuilder()
                .setColor("#9033FF")
                .setTitle('Killed')
                .setDescription(`I have killed the stinky of <@${user.id}>`);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error in executing kill command:", error);

            const errorEmbed = new EmbedBuilder()
                .setColor("#E73A3A")
                .setTitle("Error")
                .setDescription("An error occurred while executing the kill command.")
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
}

export default KillCommand;