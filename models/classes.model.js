const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  groups: {
    type: Array,
    required: true,
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    classId: {
      type: Number,
      required: true,
    },
  },
});

module.exports = mongoose.model("Class", classSchema);
