import { PushManager } from '../../server/pushManager.ts';

export default function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const subscribers = PushManager.getSubscribers();
    return res.status(200).json({
      success: true,
      subscribers,
      count: subscribers.length
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch subscribers' });
  }
}
