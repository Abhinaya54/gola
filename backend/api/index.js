const connectDB = require('../src/config/db');
const app = require('../src/app');

let dbConnected = false;

module.exports = async (req, res) => {
  try {
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
    }
    // Vercel may strip the `/api` prefix when routing to this function.
    // The Express app expects routes like `/api/health`, so ensure the
    // request URL has the `/api` prefix before forwarding.
    if (!req.url.startsWith('/api')) {
      req.url = '/api' + (req.url === '/' ? '' : req.url);
    }

    // Forward the request to the Express app instance
    return app(req, res);
  } catch (err) {
    console.error('Serverless wrapper error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
