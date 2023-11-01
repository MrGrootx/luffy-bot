const { model, Schema } = require('mongoose');

let accountSchema = new Schema({
    Guild: String,
    User: String,
    Bank: Number,
    Wallet: Number,
})

module.exports = model("ECO-Account", accountSchema);