import { ActivityType, Client } from "discord.js";
import { KOGBot } from "index.js";

export default class ReadyEvent implements GatewayEvent {
    name: string = 'ready';
    once: boolean = true;

    async code (kogBot: KOGBot, client: Client) {
        await client.user?.setPresence({
            status: "idle",
            activities: [{
                name: "with your mom",
                type: ActivityType.Playing
            }]
        })
    }
}