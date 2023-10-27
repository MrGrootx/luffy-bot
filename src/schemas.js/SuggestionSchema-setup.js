const mongoose = require('mongoose');

const suggestSchema = new mongoose.Schema({


  guildId: String,
  channelId: String,
});

module.exports = mongoose.model('Suggestion-Setup', suggestSchema);