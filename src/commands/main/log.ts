import {
    EmbedBuilder,
    ChatInputCommandInteraction,
    TextChannel,
    Colors,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    UserSelectMenuBuilder,
    ComponentType,
    MessageFlags,
    ButtonInteraction,
    CollectorFilter,
    Interaction,
    Channel
} from 'discord.js';
import { KOGBot } from '../../index.js';

class LogEventCommand implements SlashCommand {
    data = new SlashCommandBuilder()
        .setName('logevent')
        .setDescription('Log an event.');

    dev = false;
    mr = true;
    kogBot: KOGBot;

    constructor(kogBot: KOGBot) {
        this.kogBot = kogBot;
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        let loggedUsers: string[] = [];

        const userSelect = new UserSelectMenuBuilder()
            .setCustomId('attendee_list')
            .setPlaceholder('Select event attendees.')
            .setMinValues(1)
            .setMaxValues(25);

        const finalizeButton = new ButtonBuilder()
            .setCustomId('finalize_log')
            .setLabel('Finalize')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✅');

        const cancelButton = new ButtonBuilder()
            .setCustomId('cancel_log')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('❌');

        const buttonRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(finalizeButton, cancelButton);

        const selectionRow = new ActionRowBuilder<UserSelectMenuBuilder>()
            .addComponents(userSelect);

        const initialEmbed = new EmbedBuilder()
            .setColor(Colors.Yellow)
            .setTitle('Event log')
            .setDescription('Hello! Thank you for starting an event log. Please use the action row below and select all attendees that have attended the event. You can mention multiple users in one go.')
            .setFields(
                { name: 'Host', value: `<@${interaction.user.id}>` },
                { name: 'Attendees', value: 'None.' }
            )
            .setTimestamp()


        const res = await interaction.reply({
            embeds: [ initialEmbed ],
            components: [ selectionRow, buttonRow ],
            withResponse: true
        });

        const collector = res.resource?.message?.createMessageComponentCollector({
            componentType: ComponentType.UserSelect
        });

        collector?.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id) {
                i.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Unauthorized')
                            .setDescription('You are not authorized to interact with this message.\n Only the initial user can interact with this message.')
                            .setColor(Colors.Red)
                            .setTimestamp()
                            .setFooter({
                                text: 'KOG Bot',
                                iconURL: interaction.guild?.iconURL() as string
                            })
                    ],
                    flags: MessageFlags.Ephemeral
                })
                return;
            }
            const selection = i.values;
            loggedUsers = selection;

            await i.update({
                embeds: [
                    initialEmbed.setFields(
                        { name: 'Host', value: `<@${interaction.user.id}>` },
                        { name: 'Attendees', value: loggedUsers.map(user => `- <@${user}>`).join('\n') }
                    )
                ]
            });
        });

        collector?.on('end', async (collected, reason: string) => {
            if (reason === 'time') {
                const disabledRow = new ActionRowBuilder<UserSelectMenuBuilder>()
                    .addComponents(userSelect.setDisabled(true));

                await res.resource?.message?.edit({
                    embeds: [ initialEmbed.setColor(Colors.Red) ],
                    components: [ disabledRow ]
                });
            }
        });

        try {
            const collectorFilter = (i: ButtonInteraction) => i.user.id === interaction.user.id;
            const confirmation = await res.resource?.message?.awaitMessageComponent({ filter: collectorFilter, time: 3_600_000, componentType: ComponentType.Button });

            if (confirmation?.customId === 'finalize_log') {
                const logChannel = await this.kogBot.discord_client.channels.cache.get(this.kogBot.environment.discord.ids.log_channel_id) as TextChannel;

                if (!logChannel || !logChannel.isTextBased()) {
                    await confirmation.update({
                        content: 'The log channel has not been found, please contact the bot developers.',
                        embeds: [],
                        components: []
                    });
                    return;
                }

                const followUp = await confirmation.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Yellow)
                            .setTitle('Logging in process.')
                            .setDescription('The event has been submitted and is in the process of being logged. Please wait!')
                            .setThumbnail('https://cdn.astrohweston.xyz/u/87efda8e-31df-424d-9881-efb7df7c996b.gif') // i know this is hardcoded, try me
                            .setTimestamp()
                            .setFooter({
                                text: 'KOG Bot',
                                iconURL: interaction.guild?.iconURL() as string
                            })
                    ],
                    flags: MessageFlags.Ephemeral,
                    withResponse: true
                });

                await checkExistance(this.kogBot, loggedUsers);

                // Update events_attended for each attendee
                for (const userId of loggedUsers) {
                    await this.kogBot.database('users')
                        .where({ discord_id: userId })
                        .increment('events_attended', 1);
                }

                await logChannel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Event log')
                            .setColor(Colors.Purple)
                            .setFields(
                                { name: 'Host', value: `<@${interaction.user.id}>`, inline: true },
                                { name: 'Timestamp', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
                                { name: 'Attendees', value: loggedUsers.map(user => `- <@${user}>`).join(',\n') },
                            )
                            .setTimestamp()
                            .setFooter({
                                text: 'KOG Bot',
                                iconURL: interaction.guild?.iconURL() as string
                            })
                    ]
                });

                await confirmation.message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Event logged.')
                            .setDescription('The event has been successfully logged.')
                            .setColor(Colors.Green)
                            .setFields(
                                { name: 'Host', value: `<@${interaction.user.id}>` },
                                { name: 'Attendees', value: loggedUsers.map(user => `- <@${user}>`).join('\n') }
                            )
                            .setTimestamp()
                            .setFooter({
                                text: 'KOG Bot',
                                iconURL: interaction.guild?.iconURL() as string
                            })
                    ],
                    components: []
                });

                await confirmation.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Green)
                            .setTitle('Event logged.')
                            .setDescription('The event has been successfully logged.')
                            .setThumbnail('https://cdn.astrohweston.xyz/u/0ab52b9e-646f-47df-8607-f2b68b0b6307.gif') // i know this is hardcoded too, try me
                            .setTimestamp()
                            .setFooter({
                                text: 'KOG Bot',
                                iconURL: interaction.guild?.iconURL() as string
                            })
                    ]
                });
                
            } else if (confirmation?.customId === 'cancel_log') {
                await confirmation.update({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Event log cancelled.')
                            .setDescription('The event log has been cancelled.')
                            .setColor(Colors.Red)
                            .setTimestamp()
                            .setFooter({
                                text: 'KOG Bot',
                                iconURL: interaction.guild?.iconURL() as string
                            })
                    ],
                    components: []
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
}

async function checkExistance (kogBot: KOGBot, userIds: string[]) {
    for (const userId of userIds) {
        const userData = await kogBot.database('users')
        .select('*')
        .where('discord_id', userId)
        .first();

        if (!userData) {
            await kogBot.database('users')
                .insert({ discord_id: userId });
        }
    }
}

export default LogEventCommand;