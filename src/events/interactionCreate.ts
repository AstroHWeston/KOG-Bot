import { Client, Interaction, Colors, EmbedBuilder } from "discord.js";
import { KOGBot } from "index.js";

export default class ReadyEvent implements GatewayEvent {
    name: string = 'interactionCreate';
    once: boolean = false;

    async code (kogBot: KOGBot, interaction: Interaction): Promise<void> {
        if (interaction.isChatInputCommand()) {
            let command: any;

            console.log(kogBot.discord_client.commands.list);

            command = kogBot.discord_client.commands.list.get(interaction.commandName);

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