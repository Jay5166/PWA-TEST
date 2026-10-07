import type { IncomingMessage, ServerResponse } from 'http';
import { executeGroqChat } from '../server/groqManager.ts';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { knowledgeBase, messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid messages array' });
    }

    const result = await executeGroqChat(knowledgeBase || '', messages);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Error in Vercel API /api/chat:', err);
    return res.status(500).json({
      success: false,
      message: 'Sorry, I am temporarily unable to answer. Please try again.'
    });
  }
}
