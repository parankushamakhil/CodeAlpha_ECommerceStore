const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Add sample products
// @route   POST /api/products/sample
// @access  Public
router.post('/sample', async (req, res) => {
  try {
    const sampleProducts = [
      {
        name: 'Sony WH-1000XM4 Wireless Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        description: 'Industry-leading noise cancellation, exceptional sound quality, and long battery life. Perfect for music lovers and professionals.',
        price: 349.99,
        countInStock: 15,
      },
      {
        name: 'iPhone 13 Pro - 256GB',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        description: 'Latest iPhone featuring Pro camera system, Super Retina XDR display with ProMotion, and A15 Bionic chip.',
        price: 999.99,
        countInStock: 10,
      },
      {
        name: 'MacBook Pro 14-inch',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        description: 'Powerful laptop with M1 Pro chip, stunning Liquid Retina XDR display, and up to 17 hours of battery life.',
        price: 1999.99,
        countInStock: 8,
      },
      {
        name: 'Apple Watch Series 7',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500',
        description: 'Advanced health monitoring, Always-On Retina display, and comprehensive fitness tracking features.',
        price: 399.99,
        countInStock: 20,
      },
      {
        name: 'iPad Air (5th Generation)',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
        description: 'Versatile tablet with M1 chip, 10.9-inch Liquid Retina display, and Apple Pencil support.',
        price: 599.99,
        countInStock: 12,
      },
      {
        name: 'Samsung 49" Odyssey G9 Gaming Monitor',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
        description: '49-inch curved gaming monitor with 240Hz refresh rate, 1ms response time, and QLED technology.',
        price: 1499.99,
        countInStock: 5,
      },
      {
        name: 'Sony PlayStation 5',
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500',
        description: 'Next-gen gaming console featuring 4K graphics, ray tracing, and ultra-high speed SSD.',
        price: 499.99,
        countInStock: 3,
      },
      {
        name: 'Bose QuietComfort Earbuds',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
        description: 'True wireless earbuds with world-class noise cancellation and premium sound quality.',
        price: 279.99,
        countInStock: 25,
      }
    ];

    await Product.deleteMany({}); // Clear existing products
    const createdProducts = await Product.insertMany(sampleProducts);
    res.status(201).json(createdProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;