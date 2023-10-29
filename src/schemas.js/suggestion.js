const mongoose = require('mongoose');

const suggestdata = new mongoose.Schema({
  guildId: String,
  userID: String,
  messageID: String,
  MessageContent: String,
});

module.exports = mongoose.model('Suggestion-data', suggestdata);