import { ChatInputCommandInteraction } from "discord.js";
import { KOGBot } from "../../index.js"; // Adjust the path if necessary

class PingCommand implements SlashCommand {
    name = "ping";
    description = "Checks the bot's latency.";
    subcommands = [];
    parameters = [];
    dev = true; 
    kogBot: KOGBot;

    constructor(kogBot: KOGBot) {
        this.kogBot = kogBot;
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            const sent = await interaction.reply({ content: "Ping!", fetchReply: true });
            const timeDiff = (sent.createdTimestamp - interaction.createdTimestamp);
            

            await interaction.editReply(`Pong! Latency is ${timeDiff}ms.`);
        } catch (error) {
            console.error(error);
            await interaction.reply("An error occurred while trying to check the latency.");
        }
    }
}

export default PingCommand;