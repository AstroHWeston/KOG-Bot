import { ApplicationCommandOptionBase, ChatInputCommandInteraction } from "discord.js";
import { KOGBot } from "index.ts";

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
    name: string;
    description: string;
    subcommands: Array<SlashCommand>;
    parameters: Array<ApplicationCommandOptionBase>;
    dev?: boolean;
    kogBot: KOGBot;
    
    execute (interaction: ChatInputCommandInteraction): Promise<void>;
}