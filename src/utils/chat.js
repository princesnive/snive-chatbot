async function loadChatMessages(page = 1, pageSize = 10, filter = null) {
  const skip = (page - 1) * pageSize;
  let query = db.collection("chatMessages").find();
  if (filter) {
    query = query.filter(filter);
  }
  const messages = await query.skip(skip).limit(pageSize).toArray();
  return messages;
}
