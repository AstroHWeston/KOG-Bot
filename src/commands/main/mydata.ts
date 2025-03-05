/* import { config } from "../../config.toml";
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import mysql from "mysql"; 


const connection = mysql.createConnection({
    credientials to be added soon
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mydata")
        .setDescription("Returns data on yourself from DB."),

    async execute(interaction) {
        try {
            const user = interaction.user;
            const userId = interaction.user.id; // Needed for DB

            // Query the DB to fetch data related to the user
            connection.query('SELECT * FROM KOGDB WHERE userid = ?', [userId], async (err, results) => {
                if (err) {
                    console.error(err);
                    const embedError = new EmbedBuilder()
                        .setColor(config.EmbedColorError)
                        .setTitle("Database Error")
                        .setDescription("An error occurred while trying to retrieve your data.");
                    await interaction.reply({ embeds: [embedError] });
                    return;
                }

                if (results.length > 0) {

                    retrieve information here (later)

                    const embed = new EmbedBuilder()
                        .setColor(config.EmbedColor)
                        .setTitle(`Information Retrieved on ${user.username}`)
                        .addFields(
                            { name: "Events Attended", value: eventsAttended },
                            { name: "Events Hosted", value: eventsHosted }
                        );

                    await interaction.reply({ embeds: [embed] });

                } else {
                    no data found
                    const embedFail = new EmbedBuilder()
                        .setColor(config.EmbedColorFail)
                        .setTitle("No Data Found")
                        .setDescription("You need to be logged for an event before you can retrieve your data.");

                    await interaction.reply({ embeds: [embedFail] });
                }
            });

        } catch (error) {
            console.error(error);
            const embedError = new EmbedBuilder()
                .setColor(config.EmbedColorError)
                .setTitle("Error")
                .setDescription("An error occurred while trying to retrieve your data.");
            await interaction.reply({ embeds: [embedError] });
        }
    }
};

*/