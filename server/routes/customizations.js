import express from 'express';
import { db } from '../config/firebase.js';

const router = express.Router();
const customizationsCollection = db.collection('customizations');

// Create customization
router.post('/', async (req, res) => {
  try {
    const customizationRef = customizationsCollection.doc();
    const customization = {
      id: customizationRef.id,
      ...req.body,
      status: req.body.status || 'draft',
      adminNotes: req.body.adminNotes || '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await customizationRef.set(customization);
    res.status(201).json({ message: 'Customization saved', customization });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all customizations (Admin)
router.get('/admin/all', async (req, res) => {
  try {
    const snapshot = await customizationsCollection.get();
    const customizations = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(customizations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user customizations
router.get('/user/:userId', async (req, res) => {
  try {
    const snapshot = await customizationsCollection.where('userId', '==', req.params.userId).get();
    const customizations = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(customizations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update customization status (Admin)
router.put('/:id', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const customizationRef = customizationsCollection.doc(req.params.id);
    await customizationRef.update({ status, adminNotes, updatedAt: Date.now() });
    const customizationDoc = await customizationRef.get();
    const customization = { id: customizationDoc.id, ...customizationDoc.data() };
    res.json({ message: 'Customization updated', customization });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
