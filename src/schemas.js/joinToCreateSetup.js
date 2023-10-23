const { model, Schema } = require ('mongoose');

let jointocreate = new Schema({
    Guild: String,
    Channel: String,
    Category: String,
    VoiceLimit: Number,
    Log: String
})

module.exports = model('jointocreateSetup', jointocreate);