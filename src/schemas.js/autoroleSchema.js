const { model, Schema } = require('mongoose');

let autoroleSchema = new Schema({
    GuildID: String,
    RoleID: String,
})

module.exports = model("autorole-System", autoroleSchema);