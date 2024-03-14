module.exports = {
    name: 'help',
    description: 'Helps with Sawddit bot.',
    usage: 's!help',
    execute(message, args) {
        const helpEmbed = {
            "type": "rich",
            "title": "Sawddit Commands",
            "description": "",
            "color": 0x00FFFF,
            "fields": [
                // Banning
                {
                    "name": "",
                    "value": "```json\ns!ban\ns!birthday\ns!join\ns!purge\ns!register\ns!ticketing\ns!user\ns!warn```"
                },
            ]
        }
        message.reply({ embeds: [helpEmbed] });
    },
};