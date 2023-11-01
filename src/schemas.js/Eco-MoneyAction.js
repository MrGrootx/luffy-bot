const { model, Schema } = require('mongoose');

let moneySchema = new Schema({
    Guild: String,
    User: String,
    Daily: Number,
});

module.exports = model("ECO-MoneyAction", moneySchema);