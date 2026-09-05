import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './env.js';

// Stateless Google OAuth (no express-session, so it works on serverless too).
// The verify callback just passes the Google profile through — user
// provisioning happens in the auth controller after the code exchange.
let googleEnabled = false;

export function initPassport(): boolean {
  if (!config.google.clientId || !config.google.clientSecret || !config.google.callbackUrl || !config.jwt.secret) {
    return false;
  }
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackUrl,
      },
      (_accessToken, _refreshToken, profile, done) =>
        // Pass the Google profile through untouched; the auth controller
        // provisions the user from it after the code exchange.
        done(null, profile as unknown as Express.User)
    )
  );
  googleEnabled = true;
  return true;
}

export const isGoogleEnabled = (): boolean => googleEnabled;
