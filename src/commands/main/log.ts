import {
    EmbedBuilder,
    ChatInputCommandInteraction,
    TextChannel,
    DMChannel,
    NewsChannel,
    Colors,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    GuildMemberRoleManager
} from 'discord.js';
import { KOGBot } from '../../index.js';

class LogEventCommand implements SlashCommand {
    data = new SlashCommandBuilder()
        .setName('logevent')
        .setDescription('Log an event.');

    dev = false; // reverting after kapatz testing g
    kogBot: KOGBot;

    constructor(kogBot: KOGBot) {
        this.kogBot = kogBot;
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        
        const db = this.kogBot.database;

        const member = interaction.member;

        const mrRoleId = this.kogBot.environment.discord.mr_role;

        if (!member || !('roles' in member) || !(member.roles instanceof GuildMemberRoleManager) || !member.roles.cache.has(mrRoleId)) {
            const errorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle('Access Denied')
            .setDescription('You do not have the required role to use this command.')
            .setTimestamp();

            await interaction.reply({
            embeds: [errorEmbed]
            });
            return;
        }

        const initialEmbed = new EmbedBuilder()
            .setColor(Colors.Yellow)
            .setTitle('Logging Event')
            .setDescription('Please mention all attendees\n\n**Example:** <@1234567890>, <@0987654321>, <@1234567890>\n\nPlease follow the format above if you can.')
            .setTimestamp();

        await interaction.reply({ embeds: [initialEmbed] });

        const messageFilter = (response: { author: { id: string } }) => response.author.id === interaction.user.id;

        if (interaction.channel instanceof TextChannel || interaction.channel instanceof DMChannel || interaction.channel instanceof NewsChannel) {
            const messageCollected = await interaction.channel.awaitMessages({
                filter: messageFilter,
                max: 1,
                time: 60_000,
            }).catch(() => null);

            const response = messageCollected?.first()?.content;

            if (!response) {
                const timeoutEmbed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setTitle('Timeout')
                    .setDescription('You took too long to respond. Please try again.')
                    .setTimestamp();

                await interaction.followUp({ embeds: [timeoutEmbed] });
                return;
            }

            const mentionRegex = /<@!?(\d+)>/g;
            const mentions = Array.from(response.matchAll(mentionRegex), m => m[0]);

            if (mentions.length === 0) {
                const errorEmbed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setTitle('Error: No Mentions Found')
                    .setDescription('Please ensure that you mention at least one user.')
                    .setTimestamp();

                await interaction.followUp({ embeds: [errorEmbed] });
                return;
            }

            const successEmbed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setTitle('Mentions Collected')
                .setDescription(
                    `The following attendees were collected successfully:\n${mentions.join(', ')}\n\nClick **Done** to proceed or **Cancel** to stop.`
                )
                .setTimestamp();

            const actionRow = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('done')
                        .setLabel('Done')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('cancel')
                        .setLabel('Cancel')
                        .setStyle(ButtonStyle.Danger)
                );

            await interaction.followUp({ embeds: [successEmbed], components: [actionRow] });

            const buttonFilter = (i: { user: { id: string } }) => i.user.id === interaction.user.id;
            const buttonCollected = await interaction.channel.awaitMessageComponent({
                filter: buttonFilter,
                time: 60_000,
            }).catch(() => null);

            if (!buttonCollected) {
                const timeoutEmbed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setTitle('Error: Timeout')
                    .setDescription('You took too long to respond. Please try again.')
                    .setTimestamp();

                await interaction.followUp({ embeds: [timeoutEmbed] });
                return;
            }

            if (buttonCollected.customId === 'cancel') {
                const cancelEmbed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setTitle('Event Logging Canceled')
                    .setDescription('You have canceled the event log.')
                    .setTimestamp();

                await buttonCollected.reply({ embeds: [cancelEmbed] });
                return;
            }

            if (buttonCollected.customId === 'done') {
    let databaseUpdated = false; // Placeholder for database interaction logic
    const doneEmbed = new EmbedBuilder()
        .setColor(databaseUpdated ? "#9033FF" : Colors.Red)
        .setTitle('Event Logging Completed')
        .addFields(
            { name: 'Host', value: `<@${interaction.user.id}>`, inline: true },
            { name: 'Timestamp', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
            { name: 'Attendees', value: mentions.join(', ') || 'None', inline: false },
            { name: 'Squadron Rally', value: 'False', inline: false },
            { name: 'Database Updated', value: databaseUpdated ? 'True' : 'Failed', inline: false }
        )
        .setTimestamp();

    // Fetch the specific channel
    const logChannel = interaction.client.channels.cache.get('1002610487378321520') as TextChannel; // i'll optimize this im just tired :(

    if (logChannel) {
        await logChannel.send({ embeds: [doneEmbed] });
    } else {
        console.error('Log channel not found!');
    }

    const loggedEmbed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle('Logged Successfully')
        .setDescription('The event has been logged successfully.')
        .setTimestamp();

    await buttonCollected.reply({ embeds: [loggedEmbed] });
            }
        }
    }
}

export default LogEventCommand;
