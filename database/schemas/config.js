const { mongoose } = require("../connection/connect");

const Schema = new mongoose.Schema({
  server: String,
  premiumStart: { type: String, max: 20 },
  premiumEnd: { type: String, max: 20 },
  premiumEnabled: Boolean,
  commandChannel: String,
  responseChannel: String,
  cooldownTime: { type: Number, min: 1, max: 10 },
  displayLanguage: { type: String, min: 2, max: 2 },
});

module.exports = mongoose.model("configs", Schema);
