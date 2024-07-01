const NodeCache = require('node-cache');
const cacheTTL = 60; // Cache Time-to-Live (TTL) in seconds (1 minute)
const productsCache = new NodeCache({ stdTTL: cacheTTL, checkperiod: cacheTTL + 10 });

module.exports = productsCache;
