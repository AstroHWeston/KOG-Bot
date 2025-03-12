import { EmbedBuilder, ChatInputCommandInteraction, GuildMemberRoleManager, Colors } from 'discord.js';
import { KOGBot } from '../../index.js';
import knex, { Knex } from "knex";

class LogEventCommand implements SlashCommand {
    name = 'log';
    description = 'Logs official events for KOG.';
    subcommands = [];
    parameters = [];
    dev = true;
    kogBot: KOGBot;

    constructor(kogBot: KOGBot) {
        this.kogBot = kogBot;
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const allowedroleID = this.kogBot.environment.roles.mr_role;
        const logChannel = this.kogBot.environment.discord.logChannel;
        const userId = interaction.user.id; // Needed for DB
        
        // Check for required role
        if (!(interaction.member?.roles instanceof GuildMemberRoleManager) || !interaction.member.roles.cache.has(allowedroleID)) {
            const noperms = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle('Error')
                .setDescription("You don't have the required role to use this command.")
                .setTimestamp()
                .setFooter({
                    text: `Kleiner Oil Group`,
                    iconURL: interaction.guild?.iconURL() as string
                })

            await interaction.reply({ embeds: [noperms], ephemeral: true });
            return;
        }

        const logStart = new EmbedBuilder()
            .setColor('#9033FF')
            .setTitle('Logging')
            .setDescription('To log an event, please follow the format:\n\n<@1138235120424325160>,<@573540579682811906>,<@1344176447551574078>,<@110877167897853952>,<@1125601338768756756>...\n\nNames must be separated by commas and must be mentions.')
            .setTimestamp();

        await interaction.reply({ embeds: [logStart], ephemeral: true });

        if (!interaction.channel) {
            await interaction.reply('Channel not found.');
            return;
        }

        const filter = (response: any) => response.user.id === interaction.user.id;
        const collected = await interaction.channel?.awaitMessageComponent({ filter, time: 60000 }).catch(() => null);
        const response = collected?.isMessageComponent() ? collected.message.content : null;

        const mentionRegexthing = /^<@\d+>(?:,\s?<@\d+>)*$/;

        if (!mentionRegexthing.test(response!)) {
            await interaction.followUp('Invalid format. Please make sure the names are separated by commas and each name is a mention. Run the command again with the correct format.');
            return;
        }

        if (response?.toLowerCase() === 'cancel') {
            await interaction.reply(`<@${interaction.user.id}> canceled the event log.`);
            return;
        }

        if (response && typeof response === 'object' && 'message' in response && (response as any).message === 'time') {
            await interaction.reply(`<@${interaction.user.id}> you took too long to follow up, please try again.`);
            return;
        }

        if (!response) {
            await interaction.followUp('No response received. Please try again.');
            return;
        }
        const mentions = response.split(',').map((id: string) => id.trim().replace('<@', '').replace('>', ''));
        const userIds: string[] = [];

        for (const mention of mentions) {
            const userId = mention.replace('<@', '').replace('>', '');
            if (userId) userIds.push(userId);
        }

        if (userIds.length === 0) {
            await interaction.reply('No users mentioned. Please try again.');
            return;
        }

        const host = interaction.user.id;
        userIds.push(host);

        const timestamp = Math.floor(Date.now() / 1000);
        const logEmbed = new EmbedBuilder()
            .setColor('#9033FF')
            .setTitle('Event log')
            .setDescription(`A new event was logged.\n\nHost: <@${host}>\n\nTime: <t:${timestamp}:F>\n\nAttendees: ${mentions.map((id: string) => `<@${id}>`).join(', ')}\n\nSquadron Rally: False`)
            .setTimestamp();

        if (logChannel) {
            await logChannel.send({ embeds: [logEmbed] });
        }

        const db = knex({ client: 'mysql', connection: this.kogBot.environment.database });

        for (const userId of userIds) {
            try {
                const results = await db('KOGDB').where({ userId });

                if (results.length > 0) {
                    if (userId === host) {
                        await db('KOGDB').where({ userId }).update({
                            eventsAttended: db.raw('eventsAttended + 1'),
                            eventsHosted: db.raw('eventsHosted + 1')
                        });
                    } else {
                        await db('KOGDB').where({ userId }).update({
                            eventsAttended: db.raw('eventsAttended + 1')
                        });
                    }
                } else {
                    if (userId === host) {
                        await db('KOGDB').insert({ userId, eventsAttended: 1, eventsHosted: 1 });
                    } else {
                        await db('KOGDB').insert({ userId, eventsAttended: 1, eventsHosted: 0 });
                    }
                }
            } catch (err) {
                console.error(err);
            }
        }

        const dbEmbed = new EmbedBuilder()
            .setColor('#9033FF')
            .setTitle('Log Event')
            .setDescription('Database updated, event has been logged successfully.')
            .setTimestamp();

        if (logChannel) {
            await logChannel.send({ embeds: [dbEmbed] });
        }
    }
}

export default LogEventCommand;
