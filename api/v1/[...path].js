'use strict';

// Vercel serverless funksiyası: /api/v1/* → Express app
// Next.js layihəsi ilə eyni Vercel deployment-də işləyir.
module.exports = require('../../server/app');
