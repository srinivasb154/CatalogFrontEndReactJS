// eslint-disable-next-line no-undef
const API_BASE_URL = 'http://localhost:3000/api'
//const API_BASE_URL = 'http://localhost:8080/api'

const API_ENDPOINTS = {
  getCategories: `${API_BASE_URL}/categories`,
  getBrands: `${API_BASE_URL}/brands`,
  getProductsByCategoryAnsBrand: (categoryId, brandId) =>
    `${API_BASE_URL}/products?category=${categoryId}&brand=${brandId}`,
  getAssetsByProductId: (productId) =>
    `${API_BASE_URL}/products/${productId}/assets`,
  getInventoryByProductId: (productId) =>
    `${API_BASE_URL}/products/${productId}/inventory`,
  upsertInventory: `${API_BASE_URL}/products/inventory`,
  getPricingByProductId: (productId) =>
    `${API_BASE_URL}/products/${productId}/pricing`,
  upsertPricing: `${API_BASE_URL}/products/pricing`,
  getReviewsByProductId: (productId) =>
    `${API_BASE_URL}/products/${productId}/reviews`,
  searchProducts: `${API_BASE_URL}/products/search`,
  postProducts: `${API_BASE_URL}/products`,
  getProductDetails: (productId) => `${API_BASE_URL}/products/${productId}`,
  importProducts: `${API_BASE_URL}/products/import`,
  exportData: `${API_BASE_URL}/export`,
}

export default API_ENDPOINTS
