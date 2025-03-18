import { EmbedBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { KOGBot } from "../../index.js";

class InfoCommand implements SlashCommand {
    data: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("info")
        .setDescription("Displays information about KOG Bot.");
    dev = true;
    kogBot: KOGBot;

    constructor(kogBot: KOGBot) {
        this.kogBot = kogBot;
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
       
    const embed = new EmbedBuilder()
    .setTitle("KOG Bot - Version TESTING")
    .setDescription("Developed by Asynchronite and Sheepboi546 for KOG.\n\nKOG Bot is a discord.js bot created for KOG to provide for KOG in terms of logging, data retrieval, and some misc commands.\n\nMany of my commands focus around logging, this is used to make MRs life easier, and also making the publics life easier to retrieve their raid data, logs and more.\n\nAny errors must be reported to Sheepboi546 or Asyncheronite, any security must be reported via GitHubs inbuilt secruituy tab.\n\nYou can find my latest GitHub pushes and commits here: https://discord.com/channels/857445688932696104/1346226339010838528")
    .setColor("#9033FF")
    .setThumbnail("https://cdn.discordapp.com/avatars/857445688932696104/7b3b3b3b7")
    .setTimestamp();

    await interaction.reply({ embeds: [embed] });
    
}
}

export default InfoCommand;