import { REST } from "discord.js";
import * as toml from "toml";
import fs from "fs";


class SlashCommands {
    environment;
    REST: REST = new REST();

    constructor() {
        const toml_file = fs.readFileSync('config.toml', 'utf8').toString();
        this.environment = toml.parse(toml_file);
    }

    commands = {
        
    }
}