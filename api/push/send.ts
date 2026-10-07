import { PushManager } from '../../server/pushManager.ts';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, body, image, url, actionText } = req.body || {};
    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    const result = await PushManager.sendNotification({
      title,
      body,
      image,
      url,
      actionText
    });
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Unable to send notification. Please check your notification configuration.',
      details: err.message
    });
  }
}
