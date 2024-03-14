//get time local
const time = new Date().toLocaleString("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`${time} | ${client.user.username} is now online.`);
    //custom status of bot

    const activities = [
      {
        name: "/help",
        type: 0,
      },
    ];
    const customActivities = Math.floor(Math.random() * activities.length);

    client.user.setActivity(`${activities[customActivities].name}`, {
      type: activities[customActivities].type,
      status: "online",
    });

    // | ${client.guilds.cache.size} servers
  },
};
