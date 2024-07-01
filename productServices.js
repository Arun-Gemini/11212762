const axios = require('axios');
const productsCache = require('../utils/cache');

const apiUrls = [
  `http://20.244.56.144/test/register`
  `http://20.244.56.144/test/auth`
  // Add more API URLs as needed
];

async function fetchDataFromApi(apiUrl, params) {
  const cacheKey = `${apiUrl}-${JSON.stringify(params)}`;
  if (productsCache.has(cacheKey)) {
    return productsCache.get(cacheKey);
  }

  try {
    const response = await axios.get(apiUrl, { params });
    productsCache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${apiUrl}:`, error);
    return productsCache.get(cacheKey) || null; // Return cached data if available on error
  }
}

async function refreshCache(apiUrls, params) {
  for (let apiUrl of apiUrls) {
    const cacheKey = `${apiUrl}-${JSON.stringify(params)}`;
    try {
      const response = await axios.get(apiUrl, { params });
      productsCache.set(cacheKey, response.data);
    } catch (error) {
      console.error(`Error refreshing cache for ${apiUrl}:`, error);
    }
  }
}

module.exports = {
  fetchDataFromApi,
  refreshCache,
  apiUrls
};
