import { PushManager } from '../../server/pushManager.ts';

export default function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const vapid = PushManager.getVapidPublicKey();
  return res.status(200).json(vapid);
}
