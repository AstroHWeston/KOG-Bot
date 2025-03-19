import { EmbedBuilder, ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandUserOption, SlashCommandSubcommandBuilder, SlashCommandRoleOption } from "discord.js";
import { KOGBot } from "../../index.js";

class KillCommand implements SlashCommand {
    data = new SlashCommandBuilder()
        .setName('kill')
        .setDescription('Kills an entity')
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName('user')
                .setDescription('The user to kill.')
                .addUserOption((option: SlashCommandUserOption) =>
                    option
                        .setName('user')
                        .setDescription('The user to kill.')
                        .setRequired(true)
                )
            )
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
        subcommand
            .setName('role')
            .setDescription('The role to kill.')
            .addRoleOption((option: SlashCommandRoleOption) =>
                option
                    .setName('role')
                    .setDescription('The role to kill.')
                    .setRequired(true)
            )
        )

    dev = true;
    kogBot: KOGBot;

    constructor(kogBot: KOGBot) {
        this.kogBot = kogBot;
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const subCommand = interaction.options.getSubcommand();
        console.log(subCommand);
    }
}

export default KillCommand;