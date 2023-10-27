const mongoose = require('mongoose');

const suggestdata = new mongoose.Schema({
  guildId: String,
  userID: String,
  status: String,
  messageID: String,
});

module.exports = mongoose.model('Suggestion-data', suggestdata);