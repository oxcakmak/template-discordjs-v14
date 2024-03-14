const db = require('../common/database');

module.exports = {
    name: 'temp',
    description: 'temp',
    usage: 's!temp',
    async execute(message, args) {
        
        // Get server id
        const serverId = message.guild.id;

        // Check message author admin role
        const isAdmin = await message.member.roles.cache.some((role) => role.permissions.has('Administrator'));
        
        // Get the user ID of the author of the message
        const userId = message.author.id;

        if (!isAdmin) {
            return message.reply({ content: 'You do not have permission to use this command.' });
        }

        // Temp Voice: Module
        if(args[0] == "voice" && args[1] == "module"){
            const catStatus = args[2]=="open"?"open":"close";
            const catStatusName = args[2]=="open"?"opened":"closed";
            await db.query('UPDATE config SET moduleTempVoiceStatus = ? WHERE server = ?', [catStatus, serverId], async function(err, res, fields){
                if (err) throw err;
                if(res){
                    message.reply({ content: `Temp voice module is **${catStatusName}**.` });
                }else{
                    message.reply({ content: `The temp voice module could not be **${catStatusName}**.` });
                }
            });
        // Temp Voice: Channel
        }else if(args[0] == "voice" && args[1] == "channel"){
            const channel = await message.mentions.channels.first() || await message.guild.channels.resolve(args[2]);

            if(channel.type !== 'GUILD_VOICE'){
                return message.reply({ content: 'The provided channel is not a valid voice channel.' });
            }else{
                await db.query('UPDATE config SET moduleTempVoiceChannel = ? WHERE server = ?', [channel.id, serverId], async function(err, res, fields){
                    if (err) throw err;
                    if(res){
                        message.reply(`Temp voice channel, **${channel}** selected.`);
                    }else{
                        message.reply({ content: 'Temp voice channel could not be selected.' });
                    }
                });
            }
        }else if(args[0] == "voice" && args[1] == "category"){
            const channel = await message.mentions.channels.first() || await message.guild.channels.resolve(args[2]);

            if(channel.type !== 'GUILD_CATEGORY'){
                return message.reply({ content: 'The provided channel is not a valid category.' });
            }else{
                await db.query('UPDATE config SET moduleTempVoiceCategory = ? WHERE server = ?', [channel.id, serverId], async function(err, res, fields){
                    if (err) throw err;
                    if(res){
                        message.reply(`Temp voice category, **${channel}** selected.`);
                    }else{
                        message.reply({ content: 'Temp voice category could not be selected.' });
                    }
                });
            }
        }else if(args[0] == "voice" && args[1] == "setup"){
            // Default category title
            let categoryTitle = 'Create Temp Voice';
            // Default voice channel title
            let channelTitle = 'New Voice Channel';
            await db.query('SELECT moduleTempVoiceStatus FROM config WHERE server = ?', serverId, async function(err, res, fields){
                if (err) throw err;
                // Fetch if temp voice module status open then
                if(res[0]['moduleTempVoiceStatus'] == "close"){
                    message.reply(`Please activate the module first.`);
                }else{
                    // Match text within double quotes
                    const arg = message.content.match(/"([^"]+)"/g);
                    // Get the text inside the first set of double quotes
                    categoryTitle = arg[0].replace(/"/g, '').trim();
                    // Get the text inside the second set of double quotes
                    channelTitle = arg[1].replace(/"/g, '').trim();
                    
                    // Create a new category with the specified or default title
                    const category = await message.guild.channels.create({
                        name: categoryTitle,
                        type: 4,
                    });

                    // Create a new voice channel within the category with the specified or default title
                    const channel = await message.guild.channels.create({
                        name: channelTitle,
                        type: 2,
                        parent: category,
                    });
                    
                    await db.query('UPDATE config SET moduleTempVoiceChannel = ?, moduleTempVoiceCategory = ? WHERE server = ?', [channel.id, category.id, serverId], async function(err, res, fields){
                        if (err) throw err;
                        if(res){
                            message.reply(`Category "**${categoryTitle}**" and voice channel "**${channelTitle}**" created.`);
                        }else{
                            message.reply({ content: 'Temp voice category could not be selected.' });
                        }
                    });
                }
            });

            
        }else{
            const tempEmbed = {
                "type": "rich",
                "title": "",
                "description": "",
                "color": 0x00FFFF,
                "fields": [
                    {
                        "name": "",
                        "value": "```fix\nTemp```\nCelebrate the birthday of users on the server."
                    },
                    {
                        "name": "Voice Category",
                        "value": "`s!temp voice category [categoryId]`"
                    },{
                        "name": "Voice Channel",
                        "value": "`s!temp voice channel [channelId]`"
                    },
                    {
                        "name": "Voice Module Toggle",
                        "value": "`s!temp voice module [open / close]`"
                    },
                    {
                        "name": "Voice Setup",
                        "value": "`s!temp voice setup`\nor\n`s!temp voice setup \"Category Title\" \"Voice Channel Title\"`"
                    },
                    {
                        "name": "Role",
                        "value": "`s!birthday role [role or roleId]`"
                    },
                    {
                        "name": "Set Date",
                        "value": "`s!birthday set [MM/DD/YYYY]`"
                    },
                ]
            }
            message.reply({ embeds: [tempEmbed] });
        }
    },
};