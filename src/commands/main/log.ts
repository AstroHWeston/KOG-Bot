import { EmbedBuilder, ChatInputCommandInteraction, GuildMemberRoleManager, Colors, SlashCommandBuilder } from 'discord.js';
import { KOGBot } from '../../index.js';

class LogEventCommand implements SlashCommand {
    data = new SlashCommandBuilder()
        .setName('logevent')
        .setDescription('Log an event.')
    dev = true;
    kogBot: KOGBot;

    constructor(kogBot: KOGBot) {
        this.kogBot = kogBot;
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        return;
    }
}

export default LogEventCommand;
