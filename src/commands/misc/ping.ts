import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { KOGBot } from "index.ts"; 
import { SlashCommand } from "main.d.ts"; =

class PingCommand implements SlashCommand {
    name = 'ping';
    description = "Check the bot's latency";
    subcommands = [];
    parameters = [];
    dev = true;  
    kogBot: KOGBot;

    constructor(kogBot: KOGBot) {
        this.kogBot = kogBot;
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            const start = Date.now();
            await interaction.reply('Pinging...');
            const latency = Date.now() - start;

            const embed = new EmbedBuilder()
                .setColor("#9033FF")
                .setTitle('Pong!')
                .setDescription(`Returned Successfully\nBot Latency: ${latency}ms\nAPI Latency: ${interaction.client.ws.ping}ms`);

            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error("Error in executing ping command:", error);

            const errorEmbed = new EmbedBuilder()
                .setColor("#E73A3A")
                .setTitle("Error")
                .setDescription("An error occurred while executing the ping command.")
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
}

export default PingCommand;
