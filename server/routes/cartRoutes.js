const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware')();
const User = require('../models/User');
const Product = require('../models/Product');

// helper to populate the cart items with product details
async function getCartForUser(userId) {
  const user = await User.findById(userId).populate('cart.product');
  if (!user) throw new Error('User not found');
  return user.cart;
}

// GET /api/cart  -> return array of items
router.get('/', auth, async (req, res, next) => {
  try {
    const cart = await getCartForUser(req.user.id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

// POST /api/cart  -> { productId, quantity }
router.post('/', auth, async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId required' });
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const user = await User.findById(req.user.id);
    const existing = user.cart.find(c => c.product.toString() === productId);
    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      user.cart.push({ product: productId, quantity: Number(quantity) });
    }
    await user.save();

    const cart = await getCartForUser(req.user.id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

// PUT /api/cart/:itemId  -> { quantity }
router.put('/:itemId', auth, async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (quantity == null) return res.status(400).json({ message: 'quantity required' });
    const user = await User.findById(req.user.id);
    const item = user.cart.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    item.quantity = Number(quantity);
    if (item.quantity < 1) item.quantity = 1;
    await user.save();

    const cart = await getCartForUser(req.user.id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart/:itemId
router.delete('/:itemId', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Find the cart item index
    const itemIndex = user.cart.findIndex(item => item._id.toString() === req.params.itemId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Cart item not found' });
    
    // Remove the item from cart array
    user.cart.splice(itemIndex, 1);
    await user.save();

    const cart = await getCartForUser(req.user.id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

// POST /api/cart/checkout -> clear cart
router.post('/checkout', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();
    res.json({ message: 'Purchase completed', cart: [] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
