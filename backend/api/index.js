const connectDB = require('../src/config/db');
const app = require('../src/app');

let dbConnected = false;

module.exports = async (req, res) => {
  try {
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
    }
    // If the root is requested, forward explicitly to the health endpoint.
    if (!req.url || req.url === '/' || req.url === '') {
      req.url = '/api/health';
    } else if (!req.url.startsWith('/api')) {
      // For any other path that doesn't start with /api, prefix it so
      // Express routes mounted under /api will match.
      req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
    }

    // Forward the request to the Express app instance
    return app(req, res);
  } catch (err) {
    console.error('Serverless wrapper error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
