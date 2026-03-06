const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products
// Optional query params: category, q, minPrice, maxPrice, sort=price_asc|price_desc|newest
router.get('/', async (req, res, next) => {
  try {
    const { category, q, minPrice, maxPrice, sort } = req.query;
    const filter = {};

    if (category && category.toLowerCase() !== 'all') {
      filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [{ name: regex }, { description: regex }, { category: regex }];
    }

    if (minPrice) filter.price = { ...(filter.price || {}), $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...(filter.price || {}), $lte: Number(maxPrice) };

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };
    if (sort === 'newest') sortObj = { createdAt: -1 };

    const products = await Product.find(filter).sort(sortObj);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
