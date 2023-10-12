const mongoose = require("mongoose");

// Define the schema
const conversationSchema = new mongoose.Schema({
  company_id: String,
  user_id: String,
  conversation_id: String,
  category: String,
  conversation: [
    {
      message: String,
      sender: String,
      timestamp: String,
    },
  ],
  total_messages: Number,
  chat_platform: String,
  status: String,
  end_timestamp: String,
});

// Create the model
const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
