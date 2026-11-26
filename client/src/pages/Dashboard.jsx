import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Crown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ free: 0, total: 0 });

  useEffect(() => {
    Promise.all([api('/prompts?access=free'), api('/prompts')])
      .then(([free, all]) => setCounts({ free: free.prompts.length, total: all.prompts.length }))
      .catch(() => {});
  }, []);

  const isPro = user.plan === 'pro';

  return (
    <div className="container page">
      <div className="page-head">
        <span className="eyebrow">Your workspace</span>
        <h1>Good to see you, {user.name.split(' ')[0]}.</h1>
        <p className="lead">Everything you need is one click away.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <span className="eyebrow">Account</span>
          <h3>{user.name}</h3>
          <p className="muted">{user.email}</p>
          <div className="account-line">
            <span>Access level</span>
            <span className={`badge ${isPro ? 'gold' : ''}`}>
              {isPro ? <Crown size={13} /> : null} {isPro ? 'Full library' : 'Free account'}
            </span>
          </div>
        </div>

        <div className="dashboard-card">
          <span className="eyebrow">Library</span>
          <div className="stat-row">
            <div><strong>{counts.total}</strong><span className="muted"> prompts available</span></div>
            <div><strong>{counts.free}</strong><span className="muted"> open to all</span></div>
          </div>
          <p className="muted">
            {isPro
              ? 'Your licence includes every prompt in the library.'
              : 'Free prompts are open now. Unlock the full set any time.'}
          </p>
          <Link to="/library" className="button outline small">
            Browse prompts <ArrowRight size={15} />
          </Link>
        </div>

        <div className={`dashboard-card ${isPro ? 'card-quiet' : 'card-highlight'}`}>
          <span className="icon-box"><BookOpen size={20} /></span>
          <h3>{isPro ? 'Ready for the next job?' : 'Need all 100 prompts?'}</h3>
          <p>
            {isPro
              ? 'Pick a prompt, fill the inputs and apply your own professional filter.'
              : 'One licence covers troubleshooting, PMS, reports, dry dock and communication.'}
          </p>
          {isPro ? (
            <Link to="/library" className="button primary small">Open library <ArrowRight size={15} /></Link>
          ) : (
            <Link to="/checkout" className="button primary small">Unlock for S$49 <ArrowRight size={15} /></Link>
          )}
        </div>
      </div>

      <div className="dashboard-tip">
        <Sparkles size={18} />
        <p>
          <strong>Working rule:</strong> AI structures the information. You own the decision.
        </p>
      </div>
    </div>
  );
}
