
/*import {config} from "../../config.toml"
import {SlashCommandBuilder, EmbedBuilder} from "discord.js"


module.exports = {
    data: new SlashCommandBuilder()
       .setName("mydata")
       .setDescription("Returns data on yourself from DB."),

    async execute(interaction) {
        try {
            const user = interaction.user;
            const userId = interaction.user.id; // needed for DB methinks

            if ("") { // if there is datta in the user found in DB (attended an event and logged)
                const embed = new EmbedBuilder()
                 .setColor(config.EmbedColor)
                 .setTitle(`Information Retrieved on ${user}`)
                 .addFields(
                    { name: "Events Attended", value: "DB Stuff Here" },
                    { name: "Events Hosted", value: "Events Hosted" },
                    // add a field for squads? (are they gonna last though?)
                  )
                await interaction.reply({ embed: embed})
            }
            else { // if theres no information on the user (they havent attended an event and not been logged)
                const embedFail = new EmbedBuilder()
                 .setColor(config.EmbedColorFail)
                 .setTitle("No Data Found")
                 .setDescription("You need to be logged for an event before you can retrieve your data.")
                 await interaction.reply({ embed: embedFail})
            } 
        } catch (error) {
            console.error(error);
            const embedError = new EmbedBuilder()
             .setColor(config.EmbedColorError)
             .setTitle("Error")
             .setDescription("An error occurred while trying to retrieve your data.")
             await interaction.reply({ embed: embedError})
        }
    }
}

*/