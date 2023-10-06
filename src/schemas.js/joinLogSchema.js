const { model, Schema} = require('mongoose')

let joinlogSchema = new Schema({
    GuildID: String,
    ChannelID: String,
    UserID: String,
})

module.exports = model("joinlog-System", joinlogSchema);