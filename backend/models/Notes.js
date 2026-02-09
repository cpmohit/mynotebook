const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    tag:{
        type: String,
        default: 'General'
    },
    timestamp:{
        type: Date, default: Date.now
    }
  });

  module.exports = mongoose.model('Notes', NotesSchema); // To create a new Model "Notes" with schema named "notesSchema"