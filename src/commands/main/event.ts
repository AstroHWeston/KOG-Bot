/* import { EmbedBuilder, ChatInputCommandInteraction, GuildMemberRoleManager } from 'discord.js';
import { KOGBot } from '../../index.js';
import knex from "knex";
import uuid from "uuid"; // not UUID v8 :nerd:

class EventCommand implements SlashCommand {
    name = 'event';
    description = 'Creates official events for KOG.';
    subcommands = [];
    parameters = [];
    dev = true;
    kogBot: KOGBot;

    constructor(kogBot: KOGBot) {
        this.kogBot = kogBot;
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        // create subcommands
            // create subcommand
                // modal handling - async plz
                // Create event 
                // store UUID in DB
            // cancel command
                // message in KOG
                // import UUID in the parameter option bit
                // delete UUID from DB
            // reschedule parameter???
                // uuid required again
                // maybe but yeah maybe just another modal again
            // start
                // uuid required again
                // pings and start
            // end
                // uuid required again
                // pings and end
                // delete UUID from DB
                
        // async dont delete or DEATH
    }
}

export default EventCommand;

*/