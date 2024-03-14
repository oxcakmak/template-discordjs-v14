const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");

const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

//events and commands
const { loadEvents } = require("./handlers/eventHandler");
const { loadCommands } = require("./handlers/commandHandler");
const { loadDatabase } = require("./handlers/databaseHandler");
const { loadUtils } = require("./handlers/utilsHandler");

//get token
const { token } = require("./config.json");

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember],
});

client.commands = new Collection();

//login
client.login(token).then(() => {
  loadEvents(client);
  loadCommands(client);
  loadDatabase();
  loadUtils();
});
