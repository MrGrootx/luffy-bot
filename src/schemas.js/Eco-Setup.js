const { model, Schema } = require('mongoose')

let economySetup = new Schema({
    GuildID: String,
    DisEn: Boolean
})

module.exports = model('Economy-setup', economySetup)