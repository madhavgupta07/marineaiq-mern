import { useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login({ mode }) {
  const isRegister = mode === 'register';
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const from = location.state?.from || '/dashboard';
  if (user) return <Navigate to={from} replace />;

  const update = (key) => (event) => setValues((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (isRegister) await register(values.name, values.email, values.password);
      else await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container auth-page">
      <div className="auth-card">
        <span className="eyebrow">{isRegister ? 'Create your account' : 'Welcome back'}</span>
        <h1>{isRegister ? 'Start with the free library.' : 'Sign in to your library.'}</h1>
        <p className="muted">
          {isRegister
            ? 'Save your place, copy open prompts and keep your licence in one place.'
            : 'Your prompts and licence status are ready when you are.'}
        </p>

        <form onSubmit={submit} className="auth-form">
          {isRegister && (
            <label>
              <span>Full name</span>
              <input required value={values.name} onChange={update('name')} placeholder="Your name" />
            </label>
          )}
          <label>
            <span>Work email</span>
            <input
              required
              type="email"
              value={values.email}
              onChange={update('email')}
              placeholder="you@company.com"
            />
          </label>
          <label>
            <span>Password</span>
            <input
              required
              type="password"
              minLength={isRegister ? 8 : 1}
              value={values.password}
              onChange={update('password')}
              placeholder={isRegister ? 'At least 8 characters' : 'Your password'}
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="button primary full" disabled={busy}>
            {busy ? 'One moment…' : isRegister ? 'Create account' : 'Sign in'}
            {!busy && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : 'New to MarineAIQ?'}{' '}
          <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create one'}</Link>
        </p>
      </div>

      <aside className="auth-aside">
        <ShieldCheck size={26} />
        <h3>Professional judgement first.</h3>
        <p>
          The library helps you structure a problem and communicate clearly. It never replaces
          maker instructions, class or flag requirements, or your own assessment.
        </p>
        <div className="auth-aside-tags">
          <span>Verify</span><span>Contextualise</span><span>Own the decision</span>
        </div>
      </aside>
    </div>
  );
}
