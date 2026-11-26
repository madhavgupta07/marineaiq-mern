import { useState } from 'react';
import { ArrowRight, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Checkout() {
  const { refresh } = useAuth();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  const pay = async () => {
    setStatus('processing');
    setError('');
    try {
      const created = await api('/checkout/orders', { method: 'POST' });
      setOrder(created.order);
      await api(`/checkout/orders/${created.order.id}/confirm`, { method: 'POST' });
      await refresh();
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="container page narrow-page">
        <div className="form-success big">
          <CheckCircle2 size={40} />
          <h2>The library is unlocked.</h2>
          <p>Your account now has access to all 100 prompts. Receipt: {order?.receipt}</p>
          <Link to="/library" className="button primary">Open the library <ArrowRight size={16} /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page checkout-page">
      <div className="page-head">
        <span className="eyebrow">Checkout · demo mode</span>
        <h1>Unlock the full prompt library.</h1>
        <p className="lead">
          This build uses a simulated Razorpay checkout. No card details are collected and no real
          payment is taken. The order shape is ready to swap for live Razorpay keys later.
        </p>
      </div>

      <div className="checkout-grid">
        <div className="checkout-summary">
          <h3>Order summary</h3>
          <div className="summary-line">
            <div>
              <strong>100 AI prompts for marine engineers</strong>
              <span className="muted">Founding release · one-time purchase</span>
            </div>
            <strong>S$49.00</strong>
          </div>
          <div className="summary-line muted">
            <span>Team licences</span><span>Contact us</span>
          </div>
          <div className="summary-total">
            <span>Total</span><strong>S$49.00</strong>
          </div>
          <ul className="check-list">
            <li><CheckCircle2 size={16} /> Instant access after confirmation</li>
            <li><CheckCircle2 size={16} /> Free prompt formats included</li>
            <li><CheckCircle2 size={16} /> 7-day refund window</li>
          </ul>
        </div>

        <div className="checkout-payment">
          <div className="payment-head">
            <Lock size={18} />
            <div>
              <h3>Demo payment</h3>
              <p className="muted">Powered by a Razorpay-shaped mock order</p>
            </div>
          </div>

          <div className="mock-card">
            <span className="badge">Razorpay test mode</span>
            <p>Card fields are intentionally omitted in this demo. Press the button below to simulate a successful payment and unlock your account.</p>
            {order && (
              <div className="order-ref">
                <span>Order reference</span>
                <code>{order.providerOrderId}</code>
              </div>
            )}
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="button primary full" onClick={pay} disabled={status === 'processing'}>
            {status === 'processing' ? 'Confirming…' : 'Pay S$49.00 (demo)'}
            {status !== 'processing' && <ArrowRight size={16} />}
          </button>
          <p className="form-note"><ShieldCheck size={13} /> No card number is stored or sent anywhere.</p>
        </div>
      </div>
    </div>
  );
}
