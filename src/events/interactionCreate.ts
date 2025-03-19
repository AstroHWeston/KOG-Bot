import { Client, Interaction, Colors, EmbedBuilder } from "discord.js";
import { KOGBot } from "index.js";

export default class ReadyEvent implements GatewayEvent {
    name: string = 'interactionCreate';
    once: boolean = false;

    async code (kogBot: KOGBot, interaction: Interaction): Promise<void> {
        if (interaction.isChatInputCommand()) {
            if (!interaction.guild) {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Command Execution Error")
                                .setDescription("Commands can only be executed inside guilds.")
                                .setColor(Colors.Red)
                                .setFooter({
                                    text: `${interaction.user.username}`,
                                    iconURL: interaction.user.avatarURL() as string
                                })
                                .setTimestamp()
                        ]
                    })
                } else {
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle("Command Execution Error")
                            .setDescription("Commands can only be executed inside guilds.")
                            .setColor(Colors.Red)
                            .setFooter({
                                text: `${interaction.user.username}`,
                                iconURL: interaction.user.avatarURL() as string
                            })
                            .setTimestamp()
                        ]
                    })
                }
                return;
            }
            let command: SlashCommand = kogBot.discord_client.commands.list.get(interaction.commandName);

            if (!command) {
                interaction.reply({
                    embeds:
                        [
                            new EmbedBuilder()
                                .setTitle("Command Execution Error")
                                .setDescription(`No command was found matching name \`${interaction.commandName}\``)
                                .setColor(Colors.Red)
                                .setFooter({
                                    text: `${interaction.guild?.name}`,
                                    iconURL: interaction.guild?.iconURL() as string
                                })
                                .setTimestamp()
                        ]
                });
                return;
            } else if (command.dev && !kogBot.environment.discord.dev_ids.includes(interaction.user.id)) {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Command Execution Error")
                            .setDescription(`Command \`${interaction.commandName}\` is a developer only command and cannot be executed by non-developers.`)
                            .setColor(Colors.Red)
                            .setFooter({
                                text: `${interaction.guild?.name}`,
                                iconURL: interaction.guild?.iconURL() as string
                            })
                            .setTimestamp()
                    ]
                });
                return;
            }

            try {
                await command.execute(interaction);
            } catch (err) {
                console.log(err);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'fuck' });
                } else {
                    await interaction.reply({ content: 'shit' });
                }
            }
        }
    }
}