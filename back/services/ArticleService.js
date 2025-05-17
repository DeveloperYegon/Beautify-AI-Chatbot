// services/ArticleService.js
const axios = require('axios');

exports.fetchBeautyArticles = async (query) => {
  try {
    const response = await axios.get(`https://serpapi.com/search`, {
      params: {
        q: `${query} beauty skincare site:vogue.com`,
        api_key: process.env.SERPAPI_KEY
      }
    });
    
    return response.data.organic_results.slice(0, 3).map(result => ({
      title: result.title,
      url: result.link // Changed from 'link' to 'url'
    }));
  } catch (error) {
    console.error('Article fetch error:', error);
    return [];
  }
};