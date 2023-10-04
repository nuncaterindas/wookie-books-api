module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'JWT_SUPER_SECRET',
  TOKENS_TTL: {
    access_token: '12h', // 12 hours
    refresh_token: 15, // 15 days
  },
};
