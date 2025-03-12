const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  start_time: { type: Date, required: false },
  end_time: { type: Date, required: false },
  duration: { type: String, required: false },
  reason: { type: String, required: false },
  category: { type: String, required: false },
  is_valid: { type: Boolean, required: false },
  original: { type: String, required: false },
  time: { type: Date, required: false },
  user: { type: String, required: false },
  username: { type: String, required: false },
  channel: { type: String, required: false },
  channelname: { type: String, required: false },
});

module.exports = mongoose.model("Message", messageSchema);
