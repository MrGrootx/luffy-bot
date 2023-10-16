const { model, Schema } = require('mongoose')

let ticketSchema = new Schema({
    GuildID: String,
    Category: String,
    Channel: String,
    Role: String,
    Logs: String,
})

module.exports = model('TicketSystem', ticketSchema)