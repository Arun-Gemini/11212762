const { v4: uuidv4 } = require('uuid');

function addUniqueIds(products) {
  return products.map(product => {
    const productId = uuidv4();
    product.id = productId;
    return product;
  });
}

function filterProducts(products, minPrice, maxPrice) {
  return products.filter(product => product.price >= minPrice && product.price <= maxPrice);
}

function sortProducts(products, sortBy, sortOrder) {
  return products.sort((a, b) => {
    if (sortBy === 'rating') {
      return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
    } else if (sortBy === 'price') {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    } else if (sortBy === 'company') {
      return sortOrder === 'asc' ? a.company.localeCompare(b.company) : b.company.localeCompare(a.company);
    } else if (sortBy === 'discount') {
      return sortOrder === 'asc' ? a.discount - b.discount : b.discount - a.discount;
    }
    return 0;
  });
}

function paginateProducts(products, page, pageSize) {
  const offset = (page - 1) * pageSize;
  return products.slice(offset, offset + pageSize);
}

module.exports = {
  addUniqueIds,
  filterProducts,
  sortProducts,
  paginateProducts
};
