const { model, Schema } = require("mongoose");

const yt = new Schema(
  {
    guildId: {
      type: String,
      required: true,
    },
    noficationChannelId: {
      type: String,
      required: true,
    },
    ytChannelId: {
      type: String,
      required: true,
    },
    customMessage: {
      type: String,
      required: false,
    },
    lastChecked: {
      type: String,
      required: true,
    },
    lastCheckedVid: {
      type: {
        id: {
          type: String,
          required: true,
        },
        pubDate: {
          type: Date,
          required: true,
        },
      },
      require: false,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = model("ytnotification", yt);