import crypto from 'node:crypto';
import { store } from '../store.js';
import { AppError, asyncHandler, publicUser } from '../utils/index.js';

export const LIBRARY_PRICE_CENTS = 4900; // S$49.00

// Demo checkout. The response intentionally mirrors the shape of a Razorpay
// order so the client flow can be switched to real Razorpay later with minimal
// changes: replace these two handlers with razorpay.orders.create() and verify
// the payment signature in confirmOrder before granting access.
export const createOrder = asyncHandler(async (req, res) => {
  const receipt = `maiq_${crypto.randomBytes(6).toString('hex')}`;
  const order = await store.orders.create({
    userId: req.user.id,
    amount: LIBRARY_PRICE_CENTS,
    currency: 'SGD',
    status: 'pending',
    provider: 'razorpay-mock',
    providerOrderId: `order_mock_${crypto.randomBytes(8).toString('hex')}`,
    receipt,
    paidAt: null,
  });

  res.status(201).json({
    order: {
      id: order.id,
      providerOrderId: order.providerOrderId,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    },
    key: 'rzp_test_demo_key',
    mock: true,
  });
});

export const confirmOrder = asyncHandler(async (req, res) => {
  const order = await store.orders.findById(req.params.id);
  if (!order || order.userId !== req.user.id) throw new AppError('Order not found.', 404);

  if (order.status !== 'paid') {
    await store.orders.update(order.id, { status: 'paid', paidAt: new Date().toISOString() });
    await store.users.update(req.user.id, { plan: 'pro' });
  }

  const user = await store.users.findById(req.user.id);
  res.json({ ok: true, orderId: order.id, user: publicUser(user) });
});
