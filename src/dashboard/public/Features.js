const { client } = require('../../index')
const path = require('path');
const fs = require('fs');

module.exports = {
  name: "/test",
  run: async (req, res) => {
    delete require.cache[require.resolve("../html/Features.html")];

    const users = await client.guilds.cache.reduce(
      (a, b) => a + b.memberCount,
      0
    );
    const guilds = client.guilds.cache.size;

   let file = fs.readFileSync(path.join(__dirname, "../html/Features.html"), "utf8");


    file = file.replace("$$users$$", "About Page");
    file = file.replace("$$guilds$$", "About Page");

    res.send(file);
  },
};
