import { createApp } from './app.js';
import { config } from './config/env.js';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`=========================================`);
  console.log(`🚀 IntuitionLab Backend Server Active`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`🛡️  Rate Limiting: Enabled`);
  console.log(`🔐 Supabase Auth: ${config.supabase.url ? 'Configured' : 'Dev/Mock Mode'}`);
  console.log(`🔑 Google OAuth: ${config.google.clientId && config.jwt.secret ? 'Configured' : 'Disabled (set GOOGLE_* + JWT_SECRET)'}`);
  console.log(`=========================================`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
