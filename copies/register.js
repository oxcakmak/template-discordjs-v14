const db = require('../common/database');

module.exports = {
    name: 'register',
    description: 'Registers the server.',
    usage: 's!register',
    async execute(message, args) {
        
        // Get server id
        const serverId = message.guild.id;

        // Admin role
        const admin = await message.member.roles.cache.some((role) => role.permissions.has('Administrator'));

        if (!admin) {
            return message.reply({ content: 'You do not have permission to use this command.' });
        }else{
            await db.query('SELECT * FROM config WHERE server = ?', serverId, async function(err, res, fields){
                if (err) throw err;
                if(!res){
                    message.reply({ content: 'You have a server registration.' });
                }else{
                    await db.query('INSERT INTO config (server) VALUES (?)', serverId, async function(err, res, fields){
                        if (err) throw err;
                        if(res){
                            message.reply({ content: 'Server registration success.' });
                        }else{
                            message.reply({ content: 'Server registration failed.' });
                        }
                    });
                }
            });
            await db.end();
        }
    },
};