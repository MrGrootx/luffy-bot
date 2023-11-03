const mongoose = require("mongoose"); //npm i mongoose
const mongodbURL = process.env.MONGODBURL;

const {
  ActivityType,
  EmbedBuilder,
  Embed,
  client,
  interaction,
} = require(`discord.js`);
mongoose.set("strictQuery", false);
module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`${client.user.username} is ready!`);
    //Server & Member count
    const servers = await client.guilds.cache.size;
    const users = await client.guilds.cache.reduce(
      (a, b) => a + b.memberCount,
      0
    );
    console.log(`${client.user.username} is at ${servers} Servers!`);
    console.log(`${client.user.username} has ${users} users!`);

    //MONGODB DataBase Connection
    if (!mongodbURL)
      return console.log("Error: Cannot find MongodbURL. File: *.env*");
    await mongoose.connect(mongodbURL || "", {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (mongoose.connect) {
      console.log("Connected To DataBase");
    } else {
      console.log("Connected with MONGODB: False");
    }

    // Bot Status
    setInterval(() => {
      const servers2 = client.guilds.cache.size;
      const users2 = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);

      let status = [
        {
          name: `${users2} Users`,
          type: ActivityType.Listening,
        },
        {
          name: `on ${servers2} Servers`,
          type: ActivityType.Playing,
        },
      ];
      let random = Math.floor(Math.random() * status.length);
      client.user.setActivity(status[random]);
    }, `2500`);
    


    client.application.commands.set(client.commands.map(v  => v.data)).then(cmds => {
      console.log(`${cmds.size} commands loaded`);
      cmds.toJSON().forEach(cmd => {
        const rawcommand = client.commands.get(cmd.name);
        rawcommand.id = cmd.id;

        client.commands.set(cmd.name,  rawcommand);
        // console.log(rawcommand);
      })
    });

  },
};
