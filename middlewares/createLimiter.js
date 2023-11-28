const { rateLimit } = require('express-rate-limit');

module.exports = function (numLimPerMin) {
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: numLimPerMin,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  });
  return limiter; // Return middleware
};
