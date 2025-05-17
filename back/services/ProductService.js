// services/ProductService.js
const PRODUCT_BASE_URL = process.env.PRODUCT_SEARCH_URL || "https://www.garnier.fr/skin-coach";
/**
 * Generates product recommendations based on beauty-related queries
 * @param {string} query - User's natural language question
 * @returns {string} URL for recommended products
 */
module.exports.generateProductRecommendation = (query) => {
  const productMapping = require('../config/productMapping.json');
  let searchTerm = "skincare";
  Object.keys(productMapping).forEach((keyword) => {
    if (query.toLowerCase().includes(keyword)) {
      searchTerm = productMapping[keyword];
    }
  });
  
  return `${PRODUCT_BASE_URL}?search=${encodeURIComponent(searchTerm?.[1] || "skincare")}`;
};