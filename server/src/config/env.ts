import dotenv from 'dotenv';
import path from 'path';

// Load .env from root or server
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  supabase: {
    url: process.env.SUPABASE_URL || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
  },
  jwt: {
    // Signs app tokens for Google-OAuth users + the OAuth `state` param
    secret: process.env.JWT_SECRET || '',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    // Must match an Authorized redirect URI in Google Cloud Console exactly
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || '',
  },
  rateLimits: {
    generalWindowMs: 15 * 60 * 1000, // 15 minutes
    generalMax: 100,
    authWindowMs: 15 * 60 * 1000,
    authMax: 20,
    notesWriteWindowMs: 60 * 1000, // 1 minute
    notesWriteMax: 30,
    adminWindowMs: 60 * 1000,
    adminMax: 60,
  }
};
