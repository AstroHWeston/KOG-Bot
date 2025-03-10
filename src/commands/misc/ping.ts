import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, Colors } from "discord.js";
import { KOGBot } from "index.js"; 

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
        const ping = Math.floor(interaction.client.ws.ping);

        const message = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Pong!")
                    .setDescription(`🏓**Client latency** \`${ping}\` ms\n🌐 **Round-trip** \`Calculating...\``)
                    .setColor(Colors.Blue)
            ]
        });

        const round = Math.floor(message.interaction.createdTimestamp - interaction.createdTimestamp);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Pong!")
                    .setDescription(`🏓**Client latency**: \`${ping}\` ms\n🌐 **Round-trip**: \`${round}\` ms`)
                    .setColor(Colors.Green)
            ]
        });
    }
}

export default PingCommand;