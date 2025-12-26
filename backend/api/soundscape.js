import express from 'express';
const router = express.Router();

const SOUNDCLOUD_PROFILE = 'https://soundcloud.com/anlaetan';

router.get('/status', (req, res) => {
  res.json({
    status: 'ready',
    service: 'Soundscape Engine',
    version: '1.0.0',
    soundcloud: SOUNDCLOUD_PROFILE,
    endpoints: ['/api/soundscape/status', '/api/soundscape/tracks', '/api/soundscape/sync']
  });
});

router.get('/tracks', async (req, res) => {
  res.json({
    success: true,
    profile: SOUNDCLOUD_PROFILE,
    tracks: [
      { id: 1, title: 'ANLÆTAN - Track 1', url: SOUNDCLOUD_PROFILE },
      { id: 2, title: 'ANLÆTAN - Track 2', url: SOUNDCLOUD_PROFILE },
      { id: 3, title: 'ANLÆTAN - Track 3', url: SOUNDCLOUD_PROFILE }
    ],
    note: 'Configure SOUNDCLOUD_CLIENT_ID for full API access'
  });
});

router.post('/sync', async (req, res) => {
  const { visualState, loopPhase } = req.body;
  
  res.json({
    success: true,
    sync: {
      visual: visualState || 'idle',
      loop: loopPhase || 3,
      audio: 'ambient',
      intensity: 0.5
    },
    timestamp: new Date().toISOString()
  });
});

export default router;
