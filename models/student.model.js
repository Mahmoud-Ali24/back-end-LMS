const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  classId: {
    type: Number,
    required: true,
  },
  groupId: {
    type: Number,
    required: true,
  },
  attendance: {
    type: Array,
    id: {
      type: String,
    },
    date: {
      type: Date,
    },
    status: {
      type: String,
    },
  },
  homeWorks: {
    type: Array,
    id: {
      type: String,
    },
    date: {
      type: Date,
    },
    status: {
      type: String,
    },
  },
  exams: {
    type: Array,
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    date: {
      type: Date,
    },
    degree: {
      type: Number,
    },
  },
  wordsToMemorize: {
    type: Array,
    id: {
      type: String,
    },
    date: {
      type: Date,
    },
    degree: {
      type: Number,
    },
  },
  status: {
    type: String,
    required: true,
    minlength: 0,
  },
});

module.exports = mongoose.model("Student", studentSchema);
