import { Client, IntentsBitField, Message, REST } from "discord.js";
import fs from 'fs';
import toml from 'toml';

class DBot extends Client {
    kogBot: KOGBot;
    REST: REST = new REST();

    constructor (kogBot: KOGBot) {
        super({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent
            ]
        });
        this.kogBot = kogBot;

        this.REST.setToken(this.kogBot.environment.discord.client_token);

        if (!kogBot.ci_workflow) {
            this.login(this.kogBot.environment.discord.client_token);

            this.on('ready', () => {
                console.log(`Logged in as ${this.user?.tag}`);
            });

            this.on('messageCreate', (message: Message) => {
                if (message.content === 'ping') {
                    message.reply('pong \:D');
                }
            });
        }
    }
}

class KOGBot_Client {
    environment;
    ci_workflow: boolean = false;
    discord_client: DBot;

    constructor () {
        const toml_file = fs.readFileSync('config.toml', 'utf8').toString();
        this.environment = toml.parse(toml_file);

        this.discord_client = new DBot(this);

    }
}

const KOGBot = new KOGBot_Client();
export default KOGBot;
export type KOGBot = typeof KOGBot;

// this is temporary so STUPID SHEEP CAN HAVE FUN