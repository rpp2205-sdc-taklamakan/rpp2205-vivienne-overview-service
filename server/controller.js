const Models = require('./models.js')
const TTLCache = require('@isaacs/ttlcache')
const cache = new TTLCache({ max: 20000, ttl: 50000 })

module.exports = {
  getAllProducts: (req, res) => {
    var cacheKey = 'products';

     if (cache.has(cacheKey)) {
      res.status(200).json(cache.get(cacheKey));
    } else {
    
      Models.getAllProducts(result => {
        cache.set(cacheKey, result);
        res.json(result);
      });
    }
  },

  getOneProduct : (req, res) => {
    var productId = req.params.product_id;
    var cacheKey = 'product'+productId;
    if (cache.has(cacheKey)) {
      res.status(200).json(cache.get(cacheKey));
    } else {
      Models.getOneProduct(productId, (result => {
        cache.set(cacheKey, result);
        res.status(200).json(result);
      }));
    }
   
  },

  getStyles: (req, res) => {
    var productId = req.params.product_id;
    var cacheKey = 'styles' + productId;

    if (cache.has(cacheKey)) {
      res.status(200).json(cache.get(cacheKey));
    } else {
    Models.getStyles(productId, (result => {
      cache.set(cacheKey, result);
      res.status(200).json(result);
    }));
  }
}

}