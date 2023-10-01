const { model, Schema } = require('mongoose');

// const mongoose = require('mongoose');
// const { model, Schema } = mongoose;

let testSchema = Schema({
    GuilID: String,
    UserID: String
})

module.exports = model('testSchema', testSchema);

