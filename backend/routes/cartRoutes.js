const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const cart = await Order.findOne({ user: req.user._id, isPaid: false });
    if (!cart) {
      return res.json({ orderItems: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', protect, async (req, res) => {
  console.log('Add to cart request:', req.body, 'User:', req.user);
  const { productId, qty } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Order.findOne({ user: req.user._id, isPaid: false });

    if (!cart) {
      cart = new Order({
        user: req.user._id,
        orderItems: [],
        shippingAddress: { address: '', city: '', postalCode: '', country: '' },
        paymentMethod: 'PayPal',
        totalPrice: 0,
        isPaid: false,
        isDelivered: false,
      });
    }

    const itemIndex = cart.orderItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.orderItems[itemIndex].qty = qty;
    } else {
      cart.orderItems.push({
        product: productId,
        name: product.name,
        image: product.image,
        price: product.price,
        qty,
      });
    }

    cart.totalPrice = cart.orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );

    const updatedCart = await cart.save();
    res.status(201).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
router.delete('/:productId', protect, async (req, res) => {
  try {
    const cart = await Order.findOne({ user: req.user._id, isPaid: false });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.orderItems = cart.orderItems.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    cart.totalPrice = cart.orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );

    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 