const express = require('express');
const { generateChatResponse } = require('../services/chatbot/chatbot.service');

const router = express.Router();

router.post('/', async (req, res) => {
  const { message, conversationId } = req.body;
  
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }
  if (!conversationId) {
    return res.status(400).json({ error: 'Conversation ID is required' });
  }

  try {
    const reply = await generateChatResponse(conversationId, message.trim());
    res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

module.exports = router;
