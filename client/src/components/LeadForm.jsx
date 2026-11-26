import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

const initial = {
  name: '',
  email: '',
  role: '',
  company: '',
  interest: '',
  message: '',
  website: '',
};

export default function LeadForm({ variant = 'free' }) {
  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const update = (key) => (event) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (values.website) return; // honeypot

    setStatus('loading');
    setError('');

    try {
      await api('/leads', {
        method: 'POST',
        body: {
          name: values.name,
          email: values.email,
          role: variant === 'free' ? values.role : values.company,
          interest: values.interest,
          source: variant === 'free' ? 'free-prompts' : 'contact',
          message: values.message,
        },
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  if (status === 'success') {
    return (
      <div className="form-success">
        <CheckCircle2 size={28} />
        <h4>You’re on the list.</h4>
        <p>
          {variant === 'free'
            ? 'Your details are saved. Start with the free prompts in the library.'
            : 'Thanks for reaching out — your enquiry has been saved and we will reply soon.'}
        </p>
        {variant === 'free' && (
          <Link to="/library?access=free" className="button primary small">
            Browse free prompts <ArrowRight size={15} />
          </Link>
        )}
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={submit}>
      <div className="honeypot" aria-hidden="true">
        <label>
          Leave this empty
          <input tabIndex={-1} autoComplete="off" value={values.website} onChange={update('website')} />
        </label>
      </div>

      {variant === 'contact' && (
        <div className="form-row">
          <label>
            <span>Your name</span>
            <input required value={values.name} onChange={update('name')} placeholder="Your name" />
          </label>
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
        </div>
      )}

      {variant === 'free' && (
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
      )}

      <div className="form-row">
        <label>
          <span>{variant === 'free' ? 'Your role' : 'Company or organisation (optional)'}</span>
          {variant === 'free' ? (
            <select required value={values.role} onChange={update('role')}>
              <option value="">Select your role</option>
              <option>Marine engineer</option>
              <option>Technical superintendent</option>
              <option>Chief engineer</option>
              <option>Fleet / ship-management</option>
              <option>Other</option>
            </select>
          ) : (
            <input value={values.company} onChange={update('company')} placeholder="Optional" />
          )}
        </label>

        {variant === 'contact' && (
          <label>
            <span>I’m interested in</span>
            <select value={values.interest} onChange={update('interest')}>
              <option value="">Exploring the possibilities</option>
              <option>AI strategy & consulting</option>
              <option>Smarter engineering workflows</option>
              <option>Training for the real world</option>
              <option>Prompt library (S$49)</option>
              <option>Team-licence details</option>
            </select>
          </label>
        )}
      </div>

      {variant === 'contact' && (
        <label>
          <span>What’s on your mind?</span>
          <textarea
            rows={4}
            value={values.message}
            onChange={update('message')}
            placeholder="Tell us a little about your team or challenge"
          />
        </label>
      )}

      {status === 'error' && <p className="form-error">{error}</p>}

      <button className="button primary" disabled={status === 'loading'}>
        {status === 'loading'
          ? 'Sending…'
          : variant === 'free'
            ? 'Send me the 25 prompts'
            : 'Let’s start a conversation'}
        {status !== 'loading' && <ArrowRight size={16} />}
      </button>

      <p className="form-note">
        Your details are used only to respond to your enquiry. No spam, no sharing.
      </p>
    </form>
  );
}
