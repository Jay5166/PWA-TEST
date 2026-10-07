import { PushManager } from '../../server/pushManager.ts';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscription } = req.body || {};
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Missing subscription object' });
    }
    const userAgent = req.headers['user-agent'] || '';
    const result = PushManager.addSubscription(subscription, userAgent);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to subscribe' });
  }
}
