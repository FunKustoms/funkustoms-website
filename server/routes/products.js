import express from 'express';
import { db } from '../config/firebase.js';

const router = express.Router();
const productsCollection = db.collection('products');

// Get all products
router.get('/', async (req, res) => {
  try {
    const snapshot = await productsCollection.get();
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product (Admin)
router.post('/', async (req, res) => {
  try {
    const productRef = productsCollection.doc();
    const product = {
      id: productRef.id,
      ...req.body,
      createdAt: Date.now(),
    };
    await productRef.set(product);
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
