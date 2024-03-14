const db = require('../common/database');
const { isValidDate, isDateFormatMMDDYYYY } = require('../common/utils');

module.exports = {
    name: 'birthday',
    description: 'Birthday',
    usage: 's!birthday',
    async execute(message, args) {
        
        // Get server id
        const serverId = message.guild.id;

        // Check message author admin role
        const isAdmin = await message.member.roles.cache.some((role) => role.permissions.has('Administrator'));
        
        // Get the user ID of the author of the message
        const userId = message.author.id;

        // Another definitions
        let birthdayEmbed = {};

        // command
        if(args[0] == "set"){
            if(!args[1] || !isValidDate(args[1]) || !isDateFormatMMDDYYYY(args[1])){
                message.reply({ content: 'Enter date information as **MM/DD/YYYY**!' });
            }else{
                db.query('SELECT user FROM module_birthday WHERE user = ?', userId, async function(err, res, fields){
                    if (err) throw err;
                    let dbQuery = "";
                    let dbData = [];
                    if(res.length == 1){
                        dbQuery = "UPDATE module_birthday SET birthday = ? WHERE user = ?";
                        dbData = [args[1], userId];
                    }else{
                        dbQuery = "INSERT INTO module_birthday (user, birthday) VALUES (?, ?)";
                        dbData = [userId, args[1]];
                    }
                    await db.query(dbQuery, dbData, function(err, res, fields){
                        if (err) throw err;
                        if(res){
                            message.reply({ content: `Your date of birth has been updated to **${args[1]}**.` });
                        }else{
                            message.reply({ content: 'Your date of birth could not be updated.' });
                        }
                    });
                });
            }
            
        }else if(args[0] == "module"){
            if(!args[1]){
                birthdayEmbed = {
                    "type": "rich",
                    "title": "Birthday",
                    "description": "Date of birth.",
                    "color": 0x00FFFF,
                    "fields": [
                        {
                            "name": "Module Toggle",
                            "value": "`s!birthday module [open / close]`\n\nExample:\n`s!birthday module open`"
                        },
                    ]
                }
                message.reply({ embeds: [birthdayEmbed] });
            }else{
                if (!isAdmin) {
                    return message.reply({ content: 'You do not have permission to use this command.' });
                }else{

                    const catStatus = args[1]=="open"?"open":"close";
                    const catStatusName = args[1]=="open"?"opened":"closed";
                    await db.query('UPDATE config SET moduleBirthdayStatus = ? WHERE server = ?', [catStatus, serverId], async function(err, res, fields){
                        if (err) throw err;
                        if(res){
                            message.reply({ content: `Birthday module is **${catStatusName}**.` });
                        }else{
                            message.reply({ content: `The birthday module could not be **${catStatusName}**.` });
                        }
                    });
                }
            }
        }else if(args[0] == "channel"){
            if(!args[1]){
                birthdayEmbed = {
                    "type": "rich",
                    "title": "Birthday",
                    "description": "Birthday channel.",
                    "color": 0x00FFFF,
                    "fields": [
                        {
                            "name": "Birthday Channel",
                            "value": "`s!birthday channel [mention or channelId]`\n\nExample:\n`s!birthday channel #birthday`"
                        },
                    ]
                }
                message.reply({ embeds: [birthdayEmbed] });
            }else{
                if (!isAdmin) {
                    return message.reply({ content: 'You do not have permission to use this command.' });
                }else{
                    
                    const channel = await message.mentions.channels.first() || await message.guild.channels.resolve(args[1]);

                    if(message.channel.type === 'GUILD_TEXT'){
                        return message.reply({ content: 'You do not have permission to use this command.' });
                    }else{
                        await db.query('UPDATE config SET moduleBirthdayChannel = ? WHERE server = ?', [channel.id, serverId], async function(err, res, fields){
                            if (err) throw err;
                            if(res){
                                message.reply(`Birthday channel, **<#${channel.id}>** selected.`);
                            }else{
                                message.reply({ content: 'Birthday channel could not be selected.' });
                            }
                        });
                    }
                }
            }
        }else if(args[0] == "role"){
            if(!args[1]){
                birthdayEmbed = {
                    "type": "rich",
                    "title": "Birthday Role",
                    "description": "Role assigment.",
                    "color": 0x00FFFF,
                    "fields": [
                        {
                            "name": "Birthday Role",
                            "value": "`s!birthday role [role or roleId]`\n\nExample:\n`s!birthday role @viewer`"
                        },
                    ]
                }
                message.reply({ embeds: [birthdayEmbed] });
            }else{
                if (!isAdmin) {
                    return message.reply({ content: 'You do not have permission to use this command.' });
                }
                const birthdayRole = await message.mentions.roles.first() || await message.guild.roles.cache.get(args[1]);

                if(!birthdayRole){
                    return message.reply({ content: 'Role not found!' });
                }

                await db.query('UPDATE config SET moduleBirthdayRole = ? WHERE server = ?', [birthdayRole.id, serverId], async function(err, res, fields){
                    if (err) throw err;
                    if(res){
                        message.reply(`Birthday role **<@&${birthdayRole.id}>** selected.`);
                    }else{
                        message.reply({ content: 'Birthday role could not be selected.' });
                    }
                });
            }
        }else if(args[0] == "message"){
            if(!args[1]){
                birthdayEmbed = {
                    "type": "rich",
                    "title": "Birthday Message",
                    "description": "Birthday message.",
                    "color": 0x00FFFF,
                    "fields": [
                        {
                            "name": "Birthday Message",
                            "value": "`s!birthday message [message]`\n\nExample:\n`s!birthday message Happy birthday **_USER_**, you are now _AGE_ years old.`"
                        },
                    ]
                }
                message.reply({ embeds: [birthdayEmbed] });
            }else{
                const birthDayMessage = message.content.replace("s!birthday message ", "");
                
                if (!isAdmin) {
                    return message.reply({ content: 'You do not have permission to use this command.' });
                }
                
                await db.query('SELECT server, premiumStatus FROM config WHERE server = ?', serverId, async function(err, res, fields){
                    if (err) throw err;
                    if(res[0]['premiumStatus'] != 'active'){
                        message.reply(`You must be a premium member to perform this operation.`);
                    }else{
                        await db.query('UPDATE config SET moduleBirthdayMessage = ? WHERE server = ?', [birthDayMessage, serverId], async function(err, res, fields){
                            if (err) throw err;
                            if(res){
                                message.reply("Birthday message set to `" + birthDayMessage + "`");
                            }else{
                                message.reply({ content: 'Birthday role could not be selected.' });
                            }
                        });
                    }
                });
            }
        }else{
            birthdayEmbed = {
                "type": "rich",
                "title": "",
                "description": "",
                "color": 0x00FFFF,
                "fields": [
                    {
                        "name": "",
                        "value": "```fix\nBirthday```\nCelebrate the birthday of users on the server."
                    },
                    {
                        "name": "Channel",
                        "value": "`s!birthday channel [mention or channelId]`"
                    },
                    {
                        "name": "Birthday Message",
                        "value": "`s!birthday message [message]`"
                    },
                    {
                        "name": "Module Toggle",
                        "value": "`s!birthday module [open / close]`"
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
            message.reply({ embeds: [birthdayEmbed] });
        }
    },
};