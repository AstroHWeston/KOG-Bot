import { ChatInputCommandInteraction, EmbedBuilder, Colors, SlashCommandBuilder } from "discord.js";
import { KOGBot } from "../../index.js";

class PingCommand implements SlashCommand {
    data = new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot\'s latency.');
    kogBot: KOGBot;

    constructor(kogBot: KOGBot) {
        this.kogBot = kogBot;
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const ping = Math.floor(interaction.client.ws.ping);
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Pong!")
                    .setDescription(`🏓**Client latency** \`${ping}\` ms.`)
                    .setColor(Colors.Blue)
            ]
        });
    }
}

export default PingCommand;