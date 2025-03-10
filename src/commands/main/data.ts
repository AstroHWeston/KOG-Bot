import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { KOGBot } from "index.js";

class GetDataCommand implements SlashCommand {
    name = "data";
    description = "Database command for KOG. ";
    subcommands = [];
    parameters = [];
    dev = true; // dev for now
    kogBot: KOGBot;

    constructor(kogBot: KOGBot) {
        this.kogBot = kogBot;
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            const user = interaction.user;
            const userId = interaction.user.id; // Needed for DB

            connection.query('SELECT * FROM KOGDB WHERE userid = ?', [userId], async (err, results) => {
                if (err) {
                    console.error(err);
                    const embedError = new EmbedBuilder()
                        .setColor("#E73A3A")
                        .setTitle("Database Error")
                        .setDescription("An error occurred while trying to retrieve your data.");
                    await interaction.reply({ embeds: [embedError] });
                    return;
                }

                if (results.length > 0) {
                  
                    const { eventsAttended, eventsHosted } = results[0];

                    const embed = new EmbedBuilder()
                        .setColor("#9033FF")
                        .setTitle(`Information Retrieved on ${user.username}`)
                        .addFields(
                            { name: "Events Attended", value: eventsAttended.toString() },
                            { name: "Events Hosted", value: eventsHosted.toString() }
                        );

                    await interaction.reply({ embeds: [embed] });

                } else {
                    const embedFail = new EmbedBuilder()
                        .setColor("#E73A3A")
                        .setTitle("No Data Found")
                        .setDescription("You need to be logged for an event before you can retrieve your data.");

                    await interaction.reply({ embeds: [embedFail] });
                }
            });

        } catch (error) {
            console.error(error);
            const embedError = new EmbedBuilder()
                .setColor("#E73A3A")
                .setTitle("Error")
                .setDescription("An error occurred while trying to retrieve your data.");
            await interaction.reply({ embeds: [embedError] });
        }
    }
}

export default GetDataCommand;