const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');

// Multer storage to frontend/images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'frontend', 'images'));
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/[^a-z0-9.\-\s]/gi, '');
    cb(null, Date.now() + ' ' + safeName);
  }
});

const upload = multer({ storage });

// POST /api/admin/product - upload single image + product data
router.post('/product', auth(true), upload.single('image'), async (req, res, next) => {
  try {
    const { name, price, category, description } = req.body;
    if (!name || !price || !category) return res.status(400).json({ message: 'Name, price and category required' });
    let imagePath = '';
    if (req.file) {
      // path accessible from /images/filename
      imagePath = '/images/' + path.basename(req.file.path);
    }
    const product = await Product.create({ name, price: Number(price), category, image: imagePath || '/images/placeholder.jpg', description: description || '' });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/product/:id - delete product
router.delete('/product/:id', auth(true), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted', product });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
