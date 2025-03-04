import { Client, GatewayIntentBits, IntentsBitField, Message } from "discord.js";
import fs from 'fs';
import toml from 'toml';

const bot_client = new Client({ intents: [ GatewayIntentBits.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent ] });

const toml_file = fs.readFileSync('config.toml', 'utf8').toString();
const env = toml.parse(toml_file);

bot_client.on("ready", () => {
    console.log("Bot is ready");
});

bot_client.on("messageCreate", (message: Message) => {
    if (message.content.includes("stinky")) {
        message.reply("mewow mrrp")
    }
});

bot_client.login(env.discord.client_token);

// this is temporary so STUPID SHEEP CAN HAVE FUN.