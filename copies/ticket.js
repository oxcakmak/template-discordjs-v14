const db = require('../common/database');
const { isValidDate, isDateFormatMMDDYYYY } = require('../common/utils');

module.exports = {
    name: 'ticket',
    description: 'ticket',
    usage: 's!ticket',
    async execute(message, args) {
        
        // Get server id
        const serverId = message.guild.id;

        // Check message author admin role
        const isAdmin = await message.member.roles.cache.some((role) => role.permissions.has('Administrator'));
        
        // Get the user ID of the author of the message
        const userId = message.author.id;

        // Another definitions
        let tickedEmbed = {};

        // command
        if(args[0] == "module"){
            if(!args[1]){
                tickedEmbed = {
                    "type": "rich",
                    "title": "Ticket Module",
                    "description": "Ticket module.",
                    "color": 0x00FFFF,
                    "fields": [
                        {
                            "name": "Module Toggle",
                            "value": "`s!ticket module [open / close]`\n\nExample:\n`s!ticket module open`"
                        },
                    ]
                }
                message.reply({ embeds: [tickedEmbed] });
            }else{
                if (!isAdmin) {
                    return message.reply({ content: 'You do not have permission to use this command.' });
                }else{
                    const catStatus = args[1]=="open"?"open":"close";
                    const catStatusName = args[1]=="open"?"opened":"closed";
                    await db.query('UPDATE config SET moduleTicketStatus = ? WHERE server = ?', [catStatus, serverId], async function(err, res, fields){
                        if (err) throw err;
                        if(res){
                            message.reply(`Ticket module is **${catStatusName}**.`);
                        }else{
                            message.reply({ content: `Ticket module could not be **${catStatusName}**.` });
                        }
                    });
                    
                }
            }
        }else if(args[0] == "category"){
            if(!args[1]){
                tickedEmbed = {
                    "type": "rich",
                    "title": "Ticket Category",
                    "description": "Ticket category.",
                    "color": 0x00FFFF,
                    "fields": [
                        {
                            "name": "Ticket Category",
                            "value": "`s!ticket category [categoryId]`\n\nExample:\n`s!ticket category 1151583814972362802`"
                        },
                    ]
                }
                message.reply({ embeds: [tickedEmbed] });
            }else{
                if (!isAdmin) {
                    return message.reply({ content: 'You do not have permission to use this command.' });
                }else{
                    await db.query('UPDATE config SET moduleTicketCategory = ? WHERE server = ?', [args[1], serverId], async function(err, res, fields){
                        if (err) throw err;
                        if(res){
                            message.reply({ content: `The category of the ticket module has been updated.` });
                        }else{
                            message.reply({ content: 'The category of the ticket module could not be updated.' });
                        }
                    });
                }
            }
        }else if(args[0] == "create"){
            tickedEmbed = {
                "type": "rich",
                "title": "Ticket Create Sample",
                "description": "Creates a sample support ticket generator within the specified category.",
                "color": 0x00FFFF,
                "fields": [
                    {
                        "name": "Ticket Create",
                        "value": "`s!ticket create \"Channel Title\" \"Ticket Title\" \"Ticket Description\" \"Button Title\"`\n\nExample:\n`s!ticket create \"open-ticket\" \"Ticket Generate\" \"Click Button and create ticket.\" \"Create Ticket\"`"
                    },
                ]
            }
            if(!args[1]){
                message.reply({ embeds: [tickedEmbed] });
            }else{
                if (!isAdmin) {
                    return message.reply({ embeds: [tickedEmbed] });
                }else{

                    // Extract the quoted phrases using a regular expression
                    const arg = await message.content.match(/"([^"]+)"/g);
                    const channelTitle = arg[0].replace(/"/g, '');;
                    const ticketTitle = arg[1].replace(/"/g, '');;
                    const ticketDescription = arg[2].replace(/"/g, '');;
                    const buttonTitle = arg[3].replace(/"/g, '');;
                
                    // Check if the command has the correct number of arguments
                    if (arg.length < 4) {
                      message.reply('Usage: `s!ticket create \"Channel Title\" \"Ticket Title\" \"Ticket Description\" \"Button Title\"`');
                      return;
                    }

                    let categoryId = 0;
                    try {

                        await db.query("SELECT moduleTicketCategory FROM config WHERE server = ?",serverId,async function (err,r,fields) {
                            if(err) throw err;

                            categoryId=await r[0]['moduleTicketCategory'];
                            const category=await message.guild.channels.cache.get(categoryId);

                            if(!categoryId) {
                                message.reply({content: `Category **${category.id}** not found.`});
                                return;
                            }

                            // Create a new text channel within the category
                            const ticketChannel=await message.guild.channels.create({
                                type: 0,
                                name: channelTitle,
                                parent: categoryId,
                                permissionOverwrites: [{
                                    id: message.guild.roles.everyone.id,
                                    read: ['SEND_MESSAGES'],
                                }]
                                /*
                                {
                                    id: config.ticketrole1,
                                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                                },
                                {
                                    id: interaction.guild.roles.everyone,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                */
                            }).then(channel => {
                                channel.send({
                                    "components": [
                                        {
                                            "type": 1,
                                            "components": [
                                                {
                                                    "style": 3,
                                                    "label": buttonTitle,
                                                    "custom_id": `createTicket`,
                                                    "disabled": false,
                                                    "type": 2
                                                }
                                            ]
                                        }
                                    ],
                                    "embeds": [
                                        {
                                            "type": "rich",
                                            "title": ticketTitle,
                                            "description": ticketDescription,
                                            "color": 0x00FFFF
                                        }
                                    ]
                                });
                            });


                            // Send an embed message to the created ticket channel
                            message.reply({content: `Ticket channel "${channelTitle}" created in category "${category.name}".`});

                        });
                        
                    } catch (error) {
                        console.error('Error creating ticket channel:', error);
                        message.reply({ content: 'An error occurred while creating the ticket channel.' });
                    }
                }
            }
        }else if(args[0] == "role"){
            if(!args[1]){
                tickedEmbed = {
                    "type": "rich",
                    "title": "Ticket Role",
                    "description": "Ticket can view, edit and close.",
                    "color": 0x00FFFF,
                    "fields": [
                        {
                            "name": "Ticket Role",
                            "value": "`s!ticket role [roleId]`\n\nExample:\n`s!ticket role 1151583814972362802`"
                        },
                    ]
                }
                message.reply({ embeds: [tickedEmbed] });
            }else{
                if (!isAdmin) {
                    return message.reply({ content: 'You do not have permission to use this command.' });
                }else{
                    let supportRole;

                    // Fetch support role
                    await db.query('SELECT moduleTicketRole FROM config WHERE server = ?', [serverId], async function(err, res){
                        supportRole = await res[0]['moduleTicketRole'];
                    });

                    // Fetch the role you want to set permissions for
                    const role = await message.guild.roles.cache.get(supportRole || args[1]);

                    if (!role) {
                        message.reply({ content: 'Role not found.' });
                        return;
                    }

                    await db.query('UPDATE config SET moduleTicketRole = ? WHERE server = ?', [args[1], serverId], async function(err, res, fields){
                        if (err) throw err;
                        if(res){
                            message.reply({ content: `Updated the ticket support role.` });
                        }else{
                            message.reply({ content: 'Failed to update ticket support role.' });
                        }
                    });
                }
            }
        }else{
            tickedEmbed = {
                "type": "rich",
                "title": "",
                "description": "",
                "color": 0x00FFFF,
                "fields": [
                    {
                        "name": "",
                        "value": "```fix\nTicketing```\nYou can create support requests with the ticket command."
                    },
                    {
                        "name": "Ticket Module",
                        "value": "`s!ticket module [open / close]`"
                    },
                    {
                        "name": "Ticket Category (Create new text channels)",
                        "value": "`s!ticket category [categoryId]`"
                    },
                    {
                        "name": "Ticket Create Sample Channel",
                        "value": "`s!ticket create \"Channel Title\" \"Ticket Title\" \"Ticket Description\" \"Button Title\"`"
                    },
                    {
                        "name": "Role (Can view, edit and close)",
                        "value": "`s!ticket role [roleId]`"
                    },
                    
                ]
            }
            message.reply({ embeds: [tickedEmbed] });
        }
    },
};