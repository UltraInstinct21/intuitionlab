// GET /api/v1/auth/status — lets the frontend show/hide the Google button.
export default function handler(_req, res) {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL, JWT_SECRET } = process.env;
  res.json({
    success: true,
    data: {
      google: Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_CALLBACK_URL && JWT_SECRET),
    },
    timestamp: new Date().toISOString(),
  });
}
