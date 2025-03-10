import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { KOGBot } from "index.js";
import knex, { Knex } from "knex";
class GetDataCommand implements SlashCommand {
    name = "data";
    description = "Database command for KOG.";
    subcommands = [];
    parameters = [];
    dev = true; 
    kogBot: KOGBot;
    db: Knex;

    constructor(kogBot: KOGBot) {
        this.kogBot = kogBot;

        // Initialize knex with database configuration from this.environment.database
        this.db = knex({
            client: 'mysql',
            connection: {
                host: this.kogBot.environment.database.host,
                user: this.kogBot.environment.database.user,
                password: this.kogBot.environment.database.password,
                database: this.kogBot.environment.database.name
            }
        });
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            const user = interaction.user;
            const userId = interaction.user.id; // Needed for DB

            const results = await this.db('KOGDB').where({ userid: userId });

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