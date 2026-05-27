import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../config/firebase.js';

const router = express.Router();
const usersCollection = db.collection('users');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await usersCollection.where('email', '==', email).limit(1).get();
    if (!existingUser.empty) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUserRef = usersCollection.doc();
    const userData = {
      id: newUserRef.id,
      name,
      email,
      phone: phone || '',
      passwordHash,
      address: '',
      role: 'customer',
      createdAt: Date.now(),
    };
    await newUserRef.set(userData);

    const token = jwt.sign({ id: newUserRef.id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({
      message: 'User registered',
      token,
      userId: newUserRef.id,
      role: 'customer',
      name,
      phone: phone || '',
      email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userSnapshot = await usersCollection.where('email', '==', email).limit(1).get();
    if (userSnapshot.empty) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await usersCollection.doc(userDoc.id).update({ lastLogin: Date.now() });

    const token = jwt.sign({ id: userDoc.id, role: user.role || 'customer' }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({
      message: 'Login successful',
      token,
      userId: userDoc.id,
      role: user.role || 'customer',
      name: user.name || '',
      phone: user.phone || '',
      email: user.email || '',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin/users', async (_req, res) => {
  try {
    const snapshot = await usersCollection.get();
    const users = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        role: data.role || 'customer',
        createdAt: data.createdAt || Date.now(),
        lastLogin: data.lastLogin || null,
        status: 'active',
      };
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
