import { Client, IntentsBitField, REST, Routes, RESTPostAPIApplicationCommandsJSONBody, Collection } from "discord.js";
import fs from 'fs';
import knex, { Knex } from "knex";
import toml from 'toml';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { join } from "path";
import url from "url";
import { readdirSync } from "fs";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

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
            this.commands.deploy().then(() => console.log("Commands deployed."));
            this.gatewayEvents.listen().then(() => console.log("Listening to events."));
            this.login(this.kogBot.environment.discord.client_token).then(() => console.log("Logged in, welcome!"));
        }
    }

    gatewayEvents: EventsClass = {
        functions: [],

        parse: async () => {
            const discordEvents: GatewayEvent[] = [];
            const eventsPath = join(__dirname, 'events');
            const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

            for (const file of eventFiles) {
                const eventPath = join(eventsPath, file);
                const importedEvent = (await import(`file://${eventPath}`)).default;

                const theEvent = new importedEvent();

                const eventName = file.replace(/\.[^/.]+$/, "");
                const eventCode = theEvent.code;
                const eventOnce: boolean = theEvent.once;

                discordEvents.push({
                    name: eventName,
                    code: eventCode.bind(null, this.kogBot),
                    once: eventOnce
                });
            }

            return discordEvents;
        },

        listen: async () => {
            const events: GatewayEvent[] = await this.gatewayEvents.parse();
            this.gatewayEvents.functions = events;

            for (const event of this.gatewayEvents.functions) {
                if (event.once) {
                    this.once(event.name, event.code);
                } else {
                    this.on(event.name, event.code);
                }
            }
        }
    }

    commands = {
        list: new Collection<any, any>(),

        parse: async () => {
            const folderPath = join(__dirname, 'commands');
            const commandCategories = fs.readdirSync(folderPath);
            const commands = new Collection<string, SlashCommand>();

            for (const category of commandCategories) {
                const commandsPath = join(folderPath, category);
                const commandFiles = readdirSync(commandsPath);

                for (const file of commandFiles) {
                    const filePath = join(commandsPath, file);
                    const commandClass = (await import(`file://${filePath}`)).default;
                    const command: SlashCommand = new commandClass(this.kogBot);
                    
                    commands.set(command.data.name, command);
                }
            }
            return commands;
        },

        deploy: async () => {
            const parsed = await this.commands.parse();
            this.commands.list = parsed;
            const JSONCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];

            this.commands.list.forEach((command) => {
                JSONCommands.push(command.data.toJSON());  
            });
        
            if (process.argv.includes('--ci')) {
                console.log("Not deploying commands because of CI environment. Commands successfully parsed!")
                process.exit(0)
            }
            if (process.argv.includes('--deploy')) {
                console.log(`Publishing ${this.commands.list.size} commands to the Discord API...`);
                await this.REST.put(
                    Routes.applicationCommands(this.kogBot.environment.discord.client_id),
                    { body: JSONCommands }
                );
            }
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