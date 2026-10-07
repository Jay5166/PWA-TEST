import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { PushManager } from './server/pushManager.ts';
import { executeGroqChat } from './server/groqManager.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health / Status endpoint
app.get('/api/status', (req, res) => {
  const vapid = PushManager.getVapidPublicKey();
  res.json({
    status: 'ok',
    groqConfigured: !!process.env.GROQ_API_KEY,
    groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    vapidConfigured: !vapid.isEphemeral,
    isEphemeralVapid: vapid.isEphemeral,
    vapidPublicKey: vapid.publicKey,
    subscribersCount: PushManager.getSubscribers().length
  });
});

// Push API routes
app.get('/api/push/vapid-public-key', (req, res) => {
  const vapid = PushManager.getVapidPublicKey();
  res.json(vapid);
});

app.post('/api/push/subscribe', (req, res) => {
  try {
    const { subscription } = req.body;
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Missing or invalid subscription object' });
    }
    const userAgent = req.headers['user-agent'] || '';
    const result = PushManager.addSubscription(subscription, userAgent);
    res.json(result);
  } catch (err: any) {
    console.error('Error in /api/push/subscribe:', err);
    res.status(500).json({ error: err.message || 'Failed to register subscription' });
  }
});

app.post('/api/push/unsubscribe', (req, res) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) {
      return res.status(400).json({ error: 'Missing endpoint' });
    }
    const result = PushManager.removeSubscription(endpoint);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to remove subscription' });
  }
});

app.get('/api/push/subscribers', (req, res) => {
  try {
    const subscribers = PushManager.getSubscribers();
    res.json({
      success: true,
      subscribers,
      count: subscribers.length
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch subscribers' });
  }
});

app.post('/api/push/send', async (req, res) => {
  try {
    const { title, body, image, url, actionText } = req.body;
    if (!title || !body) {
      return res.status(400).json({ error: 'Notification title and body are required' });
    }

    const result = await PushManager.sendNotification({
      title,
      body,
      image,
      url,
      actionText
    });

    res.json(result);
  } catch (err: any) {
    console.error('Error in /api/push/send:', err);
    res.status(500).json({
      error: 'Unable to send notification. Please check your notification configuration.',
      details: err.message
    });
  }
});

// Chat API route
app.post('/api/chat', async (req, res) => {
  try {
    const { knowledgeBase, messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid messages array' });
    }

    const result = await executeGroqChat(knowledgeBase || '', messages);
    res.json(result);
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({
      success: false,
      message: 'Sorry, I am temporarily unable to answer. Please try again.'
    });
  }
});

// Mount Vite in development or serve dist in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const portNum = typeof PORT === 'string' ? parseInt(PORT, 10) : Number(PORT);
  app.listen(portNum, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${portNum}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
