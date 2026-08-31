const pool = require('../../config/db');

async function getConversationMessages(conversationId, limit = 15) {
  try {
    const result = await pool.query(
      `SELECT role, content FROM messages 
       WHERE conversation_id = ? 
       ORDER BY created_at ASC 
       LIMIT ?`,
      [conversationId, limit]
    );
    return result.rows || [];
  } catch (err) {
    console.error('Error fetching messages:', err);
    return [];
  }
}

async function saveMessage(conversationId, role, content) {
  try {
    const convResult = await pool.query(
      `SELECT id FROM conversations WHERE id = ?`,
      [conversationId]
    );
    
    if (!convResult.rows || convResult.rows.length === 0) {
      await pool.query(
        `INSERT INTO conversations (id, title) VALUES (?, ?)`,
        [conversationId, 'New Chat']
      );
    } else {
      await pool.query(
        `UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [conversationId]
      );
    }

    await pool.query(
      `INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)`,
      [conversationId, role, content]
    );
  } catch (err) {
    console.error('Error saving message:', err);
  }
}

module.exports = {
  getConversationMessages,
  saveMessage
};
