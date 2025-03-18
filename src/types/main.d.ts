import { ApplicationCommandOptionBase, ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { KOGBot } from "index.ts";

global {
    declare interface GatewayEvent {
        name: string,
        once: boolean;
        code: (...params) => Promise<void>;
    }
    
    declare interface EventsClass {
        functions: Array<GatewayEvent>;
        parse: () => Promise<GatewayEvent[]>;
        listen: () => Promise<void>;
    }
    
    declare interface SlashCommand {
        data: SlashCommandBuilder;
        dev?: boolean;
        kogBot: KOGBot;
        
        execute (interaction: ChatInputCommandInteraction): Promise<void>;
    }
}