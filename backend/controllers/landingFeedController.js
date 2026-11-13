import { getActivityFeed } from '../service/landingFeedService.js';

export const getLandingActivityFeed = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 8, 20);
    const data = await getActivityFeed(limit);
    return res.status(200).json({
      success: true,
      message: 'Landing activity feed fetched.',
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch landing activity feed',
    });
  }
};
