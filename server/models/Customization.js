import mongoose from 'mongoose';

const customizationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  design: { type: String },
  quantity: { type: Number, default: 1 },
  estimatedPrice: { type: Number },
  status: { type: String, enum: ['draft', 'submitted', 'approved', 'rejected', 'completed'], default: 'draft' },
  adminNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Customization', customizationSchema);
