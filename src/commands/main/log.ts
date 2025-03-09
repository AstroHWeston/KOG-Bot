/* import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import mysql from "mysql";
import { KOGBot } from "index.ts";
import { SlashCommand } from "main.d.ts";

const allowedroleID = ""; // Set this later when I have perms
const logchannel = ""; // log channel
const connection = mysql.createConnection({
    // database connection details
});

class LogEventCommand implements SlashCommand {
    name = "log";
    description = "Logs official events for KOG.";
    subcommands = [];
    parameters = [];
    dev = true;
    kogBot: KOGBot;

    constructor(kogBot: KOGBot) {
        this.kogBot = kogBot;
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            // Check for required role
            if (!interaction.member?.roles.cache.has(allowedroleID)) {
                const noperms = new EmbedBuilder()
                    .setColor("#E73A3A")
                    .setTitle("Error")
                    .setDescription("You don't have the required role to use this command.")
                    .setTimestamp();

                await interaction.reply({ embeds: [noperms], ephemeral: true });
                return;
            }

            const logStart = new EmbedBuilder()
                .setColor("#9033FF")
                .setTitle("Logging")
                .setDescription("To log an event, please follow the format:\n\n<@user1>,<@user2>,<@user3>...\n\nNames must be separated by commas and must be mentions.")
                .setTimestamp();

            await interaction.reply({ embeds: [logStart], ephemeral: true });

            const filter = (message: any) => message.author.id === interaction.user.id && message.channel.id === interaction.channel.id;
            const input = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
            const response = input.first()?.content;

            const mentionRegexthing = /^<@\d+>(?:,\s?<@\d+>)*$/;

            if (!mentionRegexthing.test(response!)) {
                await interaction.followUp("Invalid format. Please make sure the names are separated by commas and each name is a mention. Run the command again with the correct format.");
                return;
            }

            if (response?.toLowerCase() === 'cancel') {
                await interaction.reply(`<@${interaction.user.id}> canceled the event log.`);
                return;
            }

            if (response instanceof Error && response.message === 'time') {
                await interaction.reply(`<@${interaction.user.id}> you took too long to follow up, please try again.`);
                return;
            }

            const mentions = response.split(',').map((id: string) => id.trim().replace('<@', '').replace('>', ''));
            const userIds: string[] = [];

            for (const mention of mentions) {
                const userId = mention.replace('<@', '').replace('>', '');
                if (userId) userIds.push(userId);
            }

            if (userIds.length === 0) {
                await interaction.reply("No users mentioned. Please try again.");
                return;
            }

            // Log the event in the log channel
            const timestamp = Math.floor(Date.now() / 1000);
            const logEmbed = new EmbedBuilder()
                .setColor("#9033FF")
                .setTitle("Log Event")
                .setDescription(`A new event was logged.\n\nHost: ${interaction.user.id}\n\nTime: <t:${timestamp}:F>\n\nAttendees: ${mentions.map(id => `<@${id}>`).join(', ')}\n\nSquadron Rally: False`)
                .setTimestamp();

            const logChannel = await interaction.client.channels.fetch(logchannel);
            if (logChannel?.isText()) {
                await logChannel.send({ embeds: [logEmbed] });
            }

            for (const userId of userIds) {
                connection.query(
                    'SELECT COUNT(*) AS eventCount FROM events WHERE userId = ?',
                    [userId],
                    async (err, results) => {
                        if (err) {
                            console.error(err);
                            await interaction.followUp("There was an error querying the database.");
                            return;
                        }

                        const eventCount = results[0]?.eventCount || 0;
                        let promotionEmbed: any;

                        if (eventCount === 5) {
                            promotionEmbed = new EmbedBuilder()
                                .setColor("#FFBF00")
                                .setTitle("Promotion Needed")
                                .setDescription(`<@${userId}> has reached 5 events! This user needs promoting.`)
                                .setTimestamp();
                        } else if (eventCount >= 10) {
                            promotionEmbed = new EmbedBuilder()
                                .setColor("#FFD700")
                                .setTitle("Promotion Needed")
                                .setDescription(`<@${userId}> has reached 10 events! Consider promoting them.`)
                                .setTimestamp();
                        }

                        if (promotionEmbed && logChannel?.isText()) {
                            await logChannel.send({ embeds: [promotionEmbed] });
                        }
                    }
                );
            }

            // database updating goes here

            const isDatabaseUpdated = true; // "oh its updated"

            if (isDatabaseUpdated) {
                const dbEmbed = new EmbedBuilder()
                    .setColor("#9033FF")
                    .setTitle("Log Event")
                    .setDescription("Database updated, event has been logged successfully.")
                    .setTimestamp();

                if (logChannel) {
                    await logChannel.send({ embeds: [dbEmbed] });
                }
            } else {
                const errorEmbed = new EmbedBuilder()
                    .setColor("#E73A3A")
                    .setTitle("Error")
                    .setDescription("An error occurred while updating the DB. The database has not been updated, and the log has failed.\nContact the admin for support.")
                    .setTimestamp();

                if (logChannel) {
                    await logChannel.send({ embeds: [errorEmbed] });
                }
            }

        } catch (error) {
            console.log(error);
            const errorEmbed = new EmbedBuilder()
                .setColor("#E73A3A")
                .setTitle("Error")
                .setDescription("An error occurred while executing this command.")
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
}

export default LogEventCommand;

*/

