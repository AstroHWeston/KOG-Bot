import { Client, Interaction, Colors, EmbedBuilder } from "discord.js";
import { KOGBot } from "index.js";

export default class ReadyEvent implements GatewayEvent {
    name: string = 'interactionCreate';
    once: boolean = false;

    async code (kogBot: KOGBot, interaction: Interaction) {
        if (interaction.isChatInputCommand()) {
            const receivedCommand = interaction.commandName;
            const params = interaction.options;
            
            const commandObj = kogBot.discord_client.commands.list.find(cmd => cmd.instance.name === receivedCommand);

            if (!commandObj) {
                interaction.reply("Command not found bro");
                return;
            }

            try {
                await commandObj.instance.execute(interaction);
            } catch (err) {
                const replied = interaction.replied || interaction.deferred;
                const replyData = {
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Command Execution Error")
                            .setDescription(`${err}`)
                            .setColor(Colors.Red)
                            .setFooter({
                                text: `${interaction.guild?.name}`,
                                iconURL: interaction.guild?.iconURL() as string
                            })
                            .setTimestamp()
                    ]
                };
            }
        }
    }
}