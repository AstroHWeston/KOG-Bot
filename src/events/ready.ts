import { ActivityType, Client } from "discord.js";
import { KOGBot } from "index.js";

export default class ReadyEvent implements GatewayEvent {
    name: string = 'ready';
    once: boolean = true;

    async code (kogBot: KOGBot, client: Client) {
        const debug = kogBot.debug;

        await client.user?.setPresence({
            status: debug ? 'dnd' : 'online',
            activities: [{
                name: debug ? 'debug mode ⚠️' : 'with Knex.',
                type: debug ? ActivityType.Competing : ActivityType.Playing
            }]
        });

        console.log(`Logged in as ${client.user?.tag}!`);
    }
}