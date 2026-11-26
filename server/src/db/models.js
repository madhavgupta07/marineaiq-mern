import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    plan: { type: String, enum: ['free', 'pro'], default: 'free' },
    unlockedPrompts: { type: [String], default: [] },
  },
  { timestamps: true },
);

const promptSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    tags: { type: [String], default: [] },
    access: { type: String, enum: ['free', 'pro'], default: 'free' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const leadSchema = new Schema(
  {
    name: { type: String, default: '', trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    role: { type: String, default: '', trim: true },
    interest: { type: String, default: '', trim: true },
    source: { type: String, enum: ['free-prompts', 'contact'], required: true },
    message: { type: String, default: '', trim: true },
  },
  { timestamps: true },
);

const orderSchema = new Schema(
  {
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'SGD' },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    provider: { type: String, default: 'razorpay-mock' },
    providerOrderId: { type: String, default: '' },
    receipt: { type: String, default: '' },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const User = mongoose.model('User', userSchema);
export const Prompt = mongoose.model('Prompt', promptSchema);
export const Lead = mongoose.model('Lead', leadSchema);
export const Order = mongoose.model('Order', orderSchema);
