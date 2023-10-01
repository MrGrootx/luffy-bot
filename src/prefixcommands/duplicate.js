const { Client , Permissions } = require('discord.js');

module.exports = {
    name: "say",
    description: "say your message",
    botPerms: ["ManageMessages"],
    
    run: async (client, message, args) => {
        
        if (!message.member.permissions.has(["Administrator"])) {
            return message.channel.send(`${message.author.username} You Don't Have **Permission** To Use This Command `) ;
        }
        if (!args.join(" ")) {
            message.channel.send("Please add some text for me to repeat");
        }
    
        message.channel.send(args.join(" "), {
            allowedMentions: { parse: ["users"] },
        });
        message.delete();
    },
};