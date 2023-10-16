const router = require("express").Router();

const {
  getConversations,
  getConversationsByCategory,
  getTotalConversationsForDay,
} = require("../../../../controllers/user/chats/ChatController");

router.route("/conversations/:company_id").get(getConversations);
router
  .route("/conversations/category/:category")
  .get(getConversationsByCategory);
router.route("/conversations/total/:date").get(getTotalConversationsForDay);

router.get("/", (req, res) => {
  res.status(200).json({ message: "Connected!" });
});

// testing route

router.get("/test/chat", async (req, res) => {
  try {
    const data = {
      company_id: "1",
      user_id: "1",
      chat_bot_token: "1-4484d03212274fa3bf19ef099a36c101",
      conversation_id: "1-4484d03212274fa3bf19ef099a36c101",
      category: "private",
      conversation: [
        {
          message: "What is my name?",
          sender: "user",
          timestamp: "2023-10-09T12:16:53.695580",
        },
        {
          message: "Your name is John Doe",
          sender: "bot",
          timestamp: "2023-10-09T12:16:53.695580",
        },
        // Ensure the third conversation object has required fields
        {
          message: "Sample message",
          sender: "user",
          timestamp: "2023-10-09T12:16:53.695580",
        },
        // ... other conversation messages
      ],
      total_messages: 10,
      chat_platform: "Whatsapp",
      status: "closed",
      end_timestamp: "2023-10-10T21:28:44.743392",
    };

    const conversation = new Conversation(data);
    await conversation.save();

    res.status(201).send("Data inserted successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

module.exports = router;
