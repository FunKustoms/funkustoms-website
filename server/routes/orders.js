import express from 'express';
import { db } from '../config/firebase.js';

const router = express.Router();
const ordersCollection = db.collection('orders');

// Create order
router.post('/', async (req, res) => {
  try {
    const orderRef = ordersCollection.doc();
    const order = {
      id: orderRef.id,
      ...req.body,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await orderRef.set(order);
    res.status(201).json({ message: 'Order created', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders (Admin)
router.get('/admin/all', async (req, res) => {
  try {
    const snapshot = await ordersCollection.get();
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const snapshot = await ordersCollection.where('userId', '==', req.params.userId).get();
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (Admin)
router.put('/:id', async (req, res) => {
  try {
    const orderRef = ordersCollection.doc(req.params.id);
    await orderRef.update({ status: req.body.status, updatedAt: Date.now() });
    const orderDoc = await orderRef.get();
    const order = { id: orderDoc.id, ...orderDoc.data() };
    res.json({ message: 'Order updated', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
