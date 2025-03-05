import { Client, IntentsBitField, Message, REST } from "discord.js";
import fs from 'fs';
import knex, { Knex } from "knex";
import toml from 'toml';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from "@sentry/profiling-node";

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
                if (message.content === 'hi') {
                    message.reply('hi');
                }
            });
        }
    }
}

class KOGBot_Client {
    environment;
    ci_workflow: boolean = false;
    debug: boolean = false;
    discord_client: DBot;
    database: Knex;
    sentry = Sentry;
    sentry_environment: string = "production"

    constructor () {
        if (process.argv.includes('--ci')) {
            console.warn("Running KOG Bot in CI environment. Production features will not be initialized.");
            this.ci_workflow = true;
        }
        if (process.argv.includes('--debug')) {
            console.warn("Running KOG Bot in Debug mode.");
            this.sentry_environment = "development";
            this.debug = true;
        }
        // Parse Configuration //
        const toml_file = fs.readFileSync('config.toml', 'utf8').toString();
        this.environment = toml.parse(toml_file);

        // Hook into the Database //
        this.database = knex({
            client: this.environment.database.client,
            connection: {
                host: this.environment.database.host,
                port: this.environment.database.port,
                user: this.environment.database.user,
                password: this.environment.database.password,
                database: this.environment.database.schema
            }
        });

        // Initialize Sentry //
        this.sentry.init({
            dsn: this.environment.sentry.dsn,
            tracesSampleRate: 1.0,
            integrations: [
                nodeProfilingIntegration()
            ]
        });
        this.sentry.profiler.startProfiler();

        this.discord_client = new DBot(this);
    }
}

const KOGBot = new KOGBot_Client();
export default KOGBot;
export type KOGBot = typeof KOGBot;

// this is temporary so STUPID SHEEP CAN HAVE FUN