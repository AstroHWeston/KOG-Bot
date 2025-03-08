/*import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import mysql from "mysql"; 
const allowedroleID = "" // do this later when I have perms
const logchannel = ""
const connection = mysql.createConnection({
    // credientials to be added soon
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName("log")
        .setDescription("Logs offical events for KOG."),

    async execute(interaction) {
        try {
            if (!interaction.member.role.cache.has(allowedroleID)) {
                const noperms = new EmbedBuilder()
                .setColor("#E73A3A")
                .setTitle("Error")
                .setDescription("You don't have the required role to use this command.")
                .setTimestamp()

                await interaction.reply({ embeds: [noperms], ephemeral: true})
            
            }

            const logStart = new EmbedBuilder()
            .setColor("#9033FF")
            .setTitle("Logging")
            .setDescription("To log an event, please follow the following format:\n\n<@1344176447551574078>,<@1138235120424325160>,<@110877167897853952>,<@573540579682811906> and so on.\n\nNames must be seperated by commas and must be mentions. Otherwise you'll be asked to re do it.\n\nYou have 2 minutes to submit attendees, before this times out.\n\nTo cancel, please type **cancel**.")
            .setTimestamp()

            await interaction.reply({ embeds: [logStart], ephemeral: true})

            const filter = (message) => message.author.id === interaction.user.id && message.channel.id === interaction.channel.id;
            const input = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
            const response = userInput.first().content;
            
            const mentionRegexthing = /^<@\d+>(?:,\s?<@\d+>)*$/;
            
            if (!mentionRegexthing.test(response)) {
                return interaction.followUp("Invalid format. Please make sure the names are separated by commas and each name is a mention. Run the command again and use the correct format.");
              }

            if (error instanceof Error && error.message === 'time') {
                return interaction.reply(`<@${interaction.user.id}> you took too long to follow up, please try again.`);
            }
            if (response.toLowerCase() === 'cancel') {
                return interaction.reply(`<@${interaction.user.id}> canceled the event log.`);
            }
            
            const mentions = response.split(',').map(id => id.trim().replace('<@', '').replace('>', ''));
            const userIds = []

            for (const mention of mentions) {
                const userId = mention.slice(2, -1)
                if (userId)
                    userIds.push(userId)
            }

            if (userIds.length === 0) {
                return interaction.reply("No users mentioned. Please try again.");
            }
            const timestamp = Math.floor(Date.now() / 1000);
            const logEmbed = new EmbedBuilder()
            .setColor("#9033FF")
            .setTitle("Log Event")
            .setDescription(`A new event was logged.\n\nHost: ${interaction.user.id}\n\nTime: <t:${timestamp}:F>\n\nAttendees: ${mentions.map(id => `<@${id}>`).join(', ')}\n\nSquadron Rally: False`) // set to false until we integrate with squads??
            .setTimestamp()

            await logchannel.send({embeds: [logStart], ephemeral: false})

            // database stuff will go here: example

            if ("We have updated the DB") {
                const DB = new EmbedBuilder()
            .setColor("#9033FF")
            .setTitle("Log Event")
            .setDescription(`Database updated, event has been logged succesfully.`)
            .setTimestamp()

            await logchannel.send({embeds: [DB], ephemeral: false})
            }
            else {
                const errorEmbed = new EmbedBuilder()
                .setColor("#E73A3A")
                .setTitle("Error")
                .setDescription("An error occurred while updating the DB. The database has not been updated and the log has failed\nContact <@1344176447551574078> or <@1138235120424325160>")
                
                await logchannel.send({embeds: [errorEmbed], ephemeral: false})
            }


        } catch (error) {
            console.log(error)
            const errorEmbed = new EmbedBuilder()
                .setColor("#E73A3A")
                .setTitle("Error")
                .setDescription("An error occurred while executing this command.")
                
                await interaction.reply({embeds: [errorEmbed], ephemeral: true})
            }
            
        }
    }
*/