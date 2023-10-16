const Conversation = require("../../../models/user");
const moment = require("moment");

exports.getConversations = async (req, res) => {
  try {
    const { company_id } = req.params;
    const conversations = await findConversationsByCompanyId(company_id);
    if (!conversations) {
      return res.status(404).json({ message: "Conversations not found" });
    }

    const modifiedConversations = conversations.map((conversation) => {
      const chatDate = moment(conversation.createdAt);
      const currentDate = moment();
      const daysAgo = currentDate.diff(chatDate, "days");
      return {
        ...conversation._doc,
        daysAgo: daysAgo,
      };
    });

    return res.status(200).json(modifiedConversations);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getConversationsByCategory = async (req, res) => {
  try {
    const { category } = req.params; // category = private || public
    const conversations = await findConversationsByCategory(category);
    if (!conversations) {
      return res.status(404).json({ message: "Conversations not found" });
    }
    return res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTotalConversationsForDay = async (req, res) => {
  try {
    const { date } = req.params; // Assuming the date is passed as a parameter
    const totalConversations = await findTotalConversationsForDay(date);
    return res.status(200).json({ totalConversations });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

async function findConversationsByCompanyId(company_id) {
  return await Conversation.find({ company_id });
}

async function findConversationsByCategory(category) {
  return await Conversation.find({ category });
}

async function findTotalConversationsForDay(date) {
  const startOfDay = moment(date).startOf("day");
  const endOfDay = moment(date).endOf("day");
  return await Conversation.countDocuments({
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });
}
