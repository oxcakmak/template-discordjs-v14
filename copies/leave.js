const db = require('../common/database');
const { isValidDate, isDateFormatMMDDYYYY } = require('../common/utils');

module.exports = {
    name: 'leave',
    description: 'Leave',
    usage: 's!leave',
    async execute(message, args) {
        
        // Get server id
        const serverId = message.guild.id;

        // Check message author admin role
        const isAdmin = await message.member.roles.cache.some((role) => role.permissions.has('Administrator'));
        
        // Get the user ID of the author of the message
        const userId = message.author.id;

        // Another definitions
        let leaveEmbed = {};

        if (!isAdmin) {
            return message.reply({ content: 'You do not have permission to use this command.' });
        }

        // command
        if(args[0] == "module"){
            if(!args[1]){
                leaveEmbed = {
                    "type": "rich",
                    "title": "Leave",
                    "description": "Leave module.",
                    "color": 0x00FFFF,
                    "fields": [
                        {
                            "name": "Module Toggle",
                            "value": "`s!leave module [open / close]`\n\nExample:\n`s!leave module open`"
                        },
                    ]
                }
                message.reply({ embeds: [leaveEmbed] });
            }else{
                const catStatus = args[1]=="open"?"open":"close";
                const catStatusName = args[1]=="open"?"opened":"closed";
                await db.query('UPDATE config SET moduleLeaveStatus = ? WHERE server = ?', [catStatus, serverId], async function(err, res, fields){
                    if (err) throw err;
                    if(res){
                        message.reply({ content: `Leave module is **${catStatusName}**.` });
                    }else{
                        message.reply({ content: `The leave module could not be **${catStatusName}**.` });
                    }
                });
            }
        }else if(args[0] == "channel"){
            if(!args[1]){
                leaveEmbed = {
                    "type": "rich",
                    "title": "Leave",
                    "description": "Leave channel.",
                    "color": 0x00FFFF,
                    "fields": [
                        {
                            "name": "Leave Channel",
                            "value": "`s!leave channel [mention or channelId]`\n\nExample:\n`s!leave channel #visitors`"
                        },
                    ]
                }
                message.reply({ embeds: [leaveEmbed] });
            }else{
                
                const channel = await message.mentions.channels.first() || await message.guild.channels.resolve(args[1]);

                if(!channel){
                    return message.reply({ content: 'Channel not found!' });
                }

                await db.query('UPDATE config SET moduleLeaveChannel = ? WHERE server = ?', [channel.id, serverId], async function(err, res, fields){
                    if (err) throw err;
                    if(res){
                        message.reply(`Leave channel, **<#${channel.id}>** selected.`);
                    }else{
                        message.reply({ content: 'Leave channel could not be selected.' });
                    }
                });
            }
        }else if(args[0] == "message"){
            if(!args[1]){
                leaveEmbed = {
                    "type": "rich",
                    "title": "Leave Message",
                    "description": "Leave message.",
                    "color": 0x00FFFF,
                    "fields": [
                        {
                            "name": "Leave Message",
                            "value": "`s!leave message [message]`\n\nExample:\n`s!leave message Good bye **_USER_**.`"
                        },
                    ]
                }
                message.reply({ embeds: [leaveEmbed] });
            }else{
                const leaveMessage = message.content.replace("s!leave message ", "");
                
                if (!isAdmin) {
                    return message.reply({ content: 'You do not have permission to use this command.' });
                }
                
                await db.query('SELECT server, premiumStatus FROM config WHERE server = ?', serverId, async function(err, res, fields){
                    if (err) throw err;
                    if(res[0]['premiumStatus'] != 'active'){
                        message.reply(`You must be a premium member to perform this operation.`);
                    }else{
                        await db.query('UPDATE config SET moduleLeaveMessage = ? WHERE server = ?', [leaveMessage, serverId], async function(err, res, fields){
                            if (err) throw err;
                            if(res){
                                message.reply("Leave message set to `" + leaveMessage + "`");
                            }else{
                                message.reply({ content: 'Failed to set leave message.' });
                            }
                        });
                    }
                });
            }
        }else{
            leaveEmbed = {
                "type": "rich",
                "title": "",
                "description": "",
                "color": 0x00FFFF,
                "fields": [
                    /*
                    {
                        "name": "",
                        "value": "```fix\nLeave```\nSends a welcome message to users leaving the server.```_MENTION_: mention a user```"
                    },
                    */
                    {
                        "name": "Channel",
                        "value": "`s!leave channel [mention or channelId]`"
                    },
                    {
                        "name": "Message",
                        "value": "`s!leave message [message]`"
                    },
                    {
                        "name": "Module Toggle",
                        "value": "`s!leave module [open / close]`"
                    },
                ]
            }
            message.reply({ embeds: [leaveEmbed] });
        }
    },
};