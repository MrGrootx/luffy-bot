const { model, Schema } = require('mongoose');

const globalUser = new Schema({
    GuildID: String,
    OwnerId: String,
})

module.exports = model("GlobalGUILDUser", globalUser);