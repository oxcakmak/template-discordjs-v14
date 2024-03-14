const db = require('../common/database');

module.exports = {
    name: 'config',
    description: 'Config',
    usage: 's!config',
    async execute(message, args) {
        
        // Get server id
        const serverId = message.guild.id;

        // Check message author admin role
        const isAdmin = message.member.roles.cache.some((role) => role.permissions.has('Administrator'));
        
        // Get the user ID of the author of the message
        const userId = message.author.id; 

        if (!isAdmin) {
            return message.reply({ content: 'You do not have permission to use this command.' });
        }

        /*
        // Display Language
        if(args[0] == "language"){

            // If language entered then
            const langCode = args[1];

            // If lang code exists then
            if(langCode){
                
                // If entered lang exists supported lang
                if (supportedLanguages.includes(langCode)) {
                    db.query('SELECT * FROM config WHERE server = ?', [langCode, serverId], function(err, res, fields){
                        if (err) throw err;
                        if(res){
                            db.query('UPDATE config SET displayLanguage = ? WHERE server = ?', [langCode, serverId], function(err, res, fields){
                                if (err) throw err;
                                if(res){
                                    message.reply(`The display language has been changed to **${langCode}**.`);
                                }else{
                                    message.reply({ content: 'Display language update failed.' });
                                }
                            });                    
                        }else{
                            message.reply({ content: 'You do not have a server registration. To register: use the `s!register` command.' });
                        }
                    });
                } else {
                    message.reply({ content: 'Unsupported language.' });
                }
            }else{
                const languageEmbed = {
                    "type": "rich",
                    "title": "Display Languages",
                    "description": "You can use the following languages:",
                    "color": 0x00FFFF,
                    "fields": [
                        {
                            "name": "Supported Languages",
                            "value": "```English: en\nTurkish: tr```\n"
                        },
                        {
                            "name": "",
                            "value": ""
                        },
                        {
                            "name": "Command Use",
                            "value": "`s!config language [language]`\n\nExample:\n`s!config language en`"
                        }
                    ]
                }
                message.reply({ embeds: [languageEmbed] });
            }
        }else */
        // Channel Management
        if(args[0] == "channel"){            

            if(!args[1]){
                const channelEmbed = {
                    "type": "rich",
                    "title": "Bot Channel",
                    "description": "The channel where the Sawddit bot and commands will run.",
                    "color": 0x00FFFF,
                    "fields": [
                        {
                            "name": "Bot Channel",
                            "value": "Command Use\n`s!config channel [mention or channelId]`\n\nExample:\n`s!config channel #bot-command`"
                        },
                    ]
                }
                message.reply({ embeds: [channelEmbed] });
            }else{
                const channelId = await message.mentions.channels.first().id || await message.guild.channels.resolve(args[1]);
                await db.query('UPDATE config SET botChannel = ? WHERE server = ?', [channelId, serverId], async function(err, res, fields){
                    if (err) throw err;
                    if(res){
                        message.reply(`Bot channel updated to **<#${channelId}>**.`);
                    }else{
                        message.reply({ content: 'Bot channel update failed.' });
                    }
                });
            }
        // Warning Management
        }else if(args[0] == "warn"){

            if(!args[1]){
                const channelEmbed = {
                    "type": "rich",
                    "title": "Warning",
                    "description": "The channel where all warnings are made.",
                    "color": 0x00FFFF,
                    "fields": [
                        {
                            "name": "Warning",
                            "value": "Command Use\n`s!config warn [mention or channelId]`\n\nExample:\n`s!config warn #bot-command`"
                        },
                    ]
                }
                message.reply({ embeds: [channelEmbed] });
            }else{
                const channelId = await message.mentions.channels.first().id || await message.guild.channels.resolve(args[1]);
                await db.query('UPDATE config SET warnChannel = ? WHERE server = ?', [channelId, serverId], async function(err, res, fields){
                    if (err) throw err;
                    if(res){
                        message.reply(`Warning channel updated to **<#${channelId}>**.`);
                    }else{
                        message.reply({ content: 'Warning channel update failed.' });
                    }
                });
            }
        // Image Management
        }else if(args[0] == "image"){
            
            if(!args[1]){
                const channelEmbed = {
                    "type": "rich",
                    "title": "Image",
                    "description": "Edit, allow or remove permissions for channels containing images or media content.",
                    "color": 0x00FFFF,
                    "fields": [
                        {
                            "name": "Channel",
                            "value": "Command Use\n`s!config image channel [mention or channelId]`\n\nExample:\n`s!config image #gallery`"
                        },
                    ]
                }
                message.reply({ embeds: [channelEmbed] });
            }else{
                const channelId = await message.mentions.channels.first().id || await message.guild.channels.resolve(args[1]);
                await db.query('UPDATE config SET imageChannel = ? WHERE server = ?', [channelId, serverId], async function(err, res, fields){
                    if (err) throw err;
                    if(res){
                        message.reply(`Image channel updated to **<#${channelId}>**.`);
                    }else{
                        message.reply({ content: 'Image channel update failed.' });
                    }
                });
            }
        }else if(args[0] == "link"){

            if(!args[1]){
                const channelEmbed = {
                    "type": "rich",
                    "title": "Link",
                    "description": "Just edit the channels where links are sent, allowing or removing permissions for certain links.",
                    "color": 0x00FFFF,
                    "fields": [
                        {
                            "name": "Channel",
                            "value": "Command Use\n`s!config link channel [mention or channelId]`\n\nExample:\n`s!config link #stream-clips`"
                        },
                    ]
                }
                message.reply({ embeds: [channelEmbed] });
            }else if(args[1] == "channel"){
                const channelId = await message.mentions.channels.first().id || await message.guild.channels.resolve(args[2]);
                await db.query('UPDATE config SET linkChannel = ? WHERE server = ?', [channelId, serverId], async function(err, res, fields){
                    if (err) throw err;
                    if(res){
                        message.reply(`Link channel updated to **<#${channelId}>**.`);
                    }else{
                        message.reply({ content: 'Link channel update failed.' });
                    }
                });
            }
        }
    },
};