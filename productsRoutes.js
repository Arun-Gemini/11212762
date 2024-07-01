const express = require('express');
const router = express.Router();
const productsCache = require('../utils/cache');
const { fetchDataFromApi, refreshCache, apiUrls } = require('../services/productService');
const { addUniqueIds, filterProducts, sortProducts, paginateProducts } = require('../utils/helpers');

router.get('/categories/:categoryname/products', async (req, res) => {
  const { categoryname } = req.params;
  const { min_price, max_price, top_n, page = 1, sort_by = 'rating', sort_order = 'desc' } = req.query;

  const minPrice = parseFloat(min_price);
  const maxPrice = parseFloat(max_price);
  const topN = parseInt(top_n);
  const pageNumber = parseInt(page);
  const pageSize = topN > 10 ? 10 : topN;

  let allProducts = [];

  // Fetch data concurrently
  const promises = apiUrls.map(apiUrl => fetchDataFromApi(apiUrl, { category: categoryname, min_price: minPrice, max_price: maxPrice }));
  const results = await Promise.all(promises);

  results.forEach(data => {
    if (data && data.products) {
      allProducts = allProducts.concat(data.products);
    }
  });

  // Refresh cache in the background
  refreshCache(apiUrls, { category: categoryname, min_price: minPrice, max_price: maxPrice });

  const filteredProducts = filterProducts(allProducts, minPrice, maxPrice);
  const sortedProducts = sortProducts(filteredProducts, sort_by, sort_order);
  const paginatedProducts = paginateProducts(sortedProducts, pageNumber, pageSize);
  const productsWithIds = addUniqueIds(paginatedProducts);

  res.json(productsWithIds);
});

router.get('/categories/:categoryname/products/:productid', (req, res) => {
  const { productid } = req.params;

  const product = productsCache.get(productid);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

module.exports = router;
