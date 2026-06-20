const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: false,
  },
 
  time: {
    type: String,
    required: true,
  },
 
});

const model = mongoose.models?.User || mongoose.model("User", schema);

module.exports = model;
