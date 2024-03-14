const db = require('../common/database');
const { isValidDate, isDateFormatMMDDYYYY } = require('../common/utils');

module.exports = {
    name: 'join',
    description: 'Join',
    usage: 's!join',
    async execute(message, args) {
        
        // Get server id
        const serverId = message.guild.id;

        // Check message author admin role
        const isAdmin = await message.member.roles.cache.some((role) => role.permissions.has('Administrator'));
        
        // Get the user ID of the author of the message
        const userId = message.author.id;

        // Another definitions
        let joinEmbed = {};

        if (!isAdmin) {
            return message.reply({ content: 'You do not have permission to use this command.' });
        }

        // command
        if(args[0] == "module"){
            if(!args[1]){
                joinEmbed = {
                    "type": "rich",
                    "title": "Join",
                    "description": "Join module.",
                    "color": 0x00FFFF,
                    "fields": [
                        {
                            "name": "Module Toggle",
                            "value": "`s!join module [open / close]`\n\nExample:\n`s!join module open`"
                        },
                    ]
                }
                message.reply({ embeds: [joinEmbed] });
            }else{
                const catStatus = args[1]=="open"?"open":"close";
                const catStatusName = args[1]=="open"?"opened":"closed";
                await db.query('UPDATE config SET moduleJoinStatus = ? WHERE server = ?', [catStatus, serverId], async function(err, res, fields){
                    if (err) throw err;
                    if(res){
                        message.reply({ content: `Join module is **${catStatusName}**.` });
                    }else{
                        message.reply({ content: `The join module could not be **${catStatusName}**.` });
                    }
                });
            }
        }else if(args[0] == "channel"){
            if(!args[1]){
                joinEmbed = {
                    "type": "rich",
                    "title": "Join",
                    "description": "Join channel.",
                    "color": 0x00FFFF,
                    "fields": [
                        {
                            "name": "Join Channel",
                            "value": "`s!join channel [mention or channelId]`\n\nExample:\n`s!join channel #visitors`"
                        },
                    ]
                }
                message.reply({ embeds: [joinEmbed] });
            }else{
                
                const channel = await message.mentions.channels.first() || await message.guild.channels.resolve(args[1]);

                if(!channel){
                    return message.reply({ content: 'Channel not found!' });
                }

                await db.query('UPDATE config SET moduleJoinChannel = ? WHERE server = ?', [channel.id, serverId], async function(err, res, fields){
                    if (err) throw err;
                    if(res){
                        message.reply(`Join channel, **<#${channel.id}>** selected.`);
                    }else{
                        message.reply({ content: 'Join channel could not be selected.' });
                    }
                });
            }
        }else if(args[0] == "role"){
            if(!args[1]){
                joinEmbed = {
                    "type": "rich",
                    "title": "Join Role",
                    "description": "Role assigment.",
                    "color": 0x00FFFF,
                    "fields": [
                        {
                            "name": "Join Role",
                            "value": "`s!join role [role or roleId]`\n\nExample:\n`s!join role @viewer`"
                        },
                    ]
                }
                message.reply({ embeds: [joinEmbed] });
            }else{
                
                const joinRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);

                if(!joinRole){
                    return message.reply({ content: 'Role not found!' });
                }

                await db.query('UPDATE config SET moduleJoinRole = ? WHERE server = ?', [joinRole.id, serverId], async function(err, res, fields){
                    if (err) throw err;
                    if(res){
                        message.reply(`Join role **<@&${joinRole.id}>** selected.`);
                    }else{
                        message.reply({ content: 'Join role could not be selected.' });
                    }
                });
            }
        }else if(args[0] == "message"){
            if(!args[1]){
                joinEmbed = {
                    "type": "rich",
                    "title": "Join Message",
                    "description": "Join message.",
                    "color": 0x00FFFF,
                    "fields": [
                        {
                            "name": "Join Message",
                            "value": "`s!join message [message]`\n\nExample:\n`s!join message Welcome **_USER_**.`"
                        },
                    ]
                }
                message.reply({ embeds: [joinEmbed] });
            }else{
                const joinMessage = message.content.replace("s!join message ", "");
                
                if (!isAdmin) {
                    return message.reply({ content: 'You do not have permission to use this command.' });
                }
                
                await db.query('SELECT server, premiumStatus FROM config WHERE server = ?', serverId, async function(err, res, fields){
                    if (err) throw err;
                    if(res[0]['premiumStatus'] != 'active'){
                        message.reply(`You must be a premium member to perform this operation.`);
                    }else{
                        await db.query('UPDATE config SET moduleJoinMessage = ? WHERE server = ?', [joinMessage, serverId], async function(err, res, fields){
                            if (err) throw err;
                            if(res){
                                message.reply("Join message set to `" + joinMessage + "`");
                            }else{
                                message.reply({ content: 'Failed to set join message.' });
                            }
                        });
                    }
                });
            }
        }else{
            joinEmbed = {
                "type": "rich",
                "title": "",
                "description": "",
                "color": 0x00FFFF,
                "fields": [
                    /*
                    {
                        "name": "Channel",
                        "value": "`s!join channel [mention or channelId]`"
                    },
                    */
                    {
                        "name": "Message",
                        "value": "`s!join message [message]`"
                    },
                    {
                        "name": "Module Toggle",
                        "value": "`s!join module [open / close]`"
                    },
                    {
                        "name": "Role",
                        "value": "`s!join role [role or roleId]`"
                    },
                ]
            }
            message.reply({ embeds: [joinEmbed] });
        }
    },
};