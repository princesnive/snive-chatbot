const mongoose = require("mongoose");

const { Schema } = mongoose;

// Define the schema
const conversationSchema = new Schema({
  company_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  chat_bot_token: {
    type: String,
    required: true,
  },
  conversation_id: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  conversation: [
    {
      message: {
        type: String,
        required: true,
      },
      sender: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  total_messages: {
    type: Number,
    default: 0,
  },
  chat_platform: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  end_timestamp: {
    type: Date,
  },
});

// Create the model
const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
