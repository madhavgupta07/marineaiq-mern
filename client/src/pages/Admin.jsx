import { useEffect, useState } from 'react';
import { Edit2, Plus, Trash2, X } from 'lucide-react';
import { api } from '../api.js';

const blankPrompt = {
  title: '',
  slug: '',
  category: '',
  summary: '',
  body: '',
  tags: '',
  access: 'free',
  featured: false,
  order: 0,
};

const tabs = [
  ['overview', 'Overview'],
  ['prompts', 'Prompts'],
  ['leads', 'Leads'],
  ['orders', 'Orders'],
];

const dateLabel = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
};

export default function Admin() {
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api(tab === 'overview' ? '/admin/overview' : `/admin/${tab}`);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [tab]);

  const changeForm = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
  };

  const editPrompt = (prompt) => {
    setForm({
      ...blankPrompt,
      ...prompt,
      tags: (prompt.tags || []).join(', '),
    });
  };

  const savePrompt = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        order: Number(form.order) || 0,
      };
      if (form.id) await api(`/admin/prompts/${form.id}`, { method: 'PUT', body: payload });
      else await api('/admin/prompts', { method: 'POST', body: payload });
      setForm(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const deletePrompt = async (prompt) => {
    if (!window.confirm(`Delete “${prompt.title}”? This cannot be undone.`)) return;
    try {
      await api(`/admin/prompts/${prompt.id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container page admin-page">
      <div className="page-head">
        <span className="eyebrow">Admin</span>
        <h1>Run the library.</h1>
        <p className="lead">Manage prompts and review the leads and orders coming through the site.</p>
      </div>

      <div className="admin-tabs">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            className={`chip ${tab === key ? 'active' : ''}`}
            onClick={() => { setTab(key); setForm(null); }}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <div className="notice error">{error}</div>}

      {tab === 'prompts' && (
        <div className="admin-actions">
          <button className="button primary small" onClick={() => setForm({ ...blankPrompt })}>
            <Plus size={15} /> New prompt
          </button>
        </div>
      )}

      {form && (
        <form className="prompt-editor" onSubmit={savePrompt}>
          <div className="editor-head">
            <h3>{form.id ? 'Edit prompt' : 'New prompt'}</h3>
            <button type="button" className="icon-button" onClick={() => setForm(null)} aria-label="Close editor">
              <X size={18} />
            </button>
          </div>
          <div className="form-row">
            <label><span>Title</span><input required value={form.title} onChange={changeForm('title')} /></label>
            <label><span>Slug (optional)</span><input value={form.slug} onChange={changeForm('slug')} placeholder="Generated from title" /></label>
          </div>
          <div className="form-row">
            <label><span>Category</span><input required value={form.category} onChange={changeForm('category')} /></label>
            <label>
              <span>Access</span>
              <select value={form.access} onChange={changeForm('access')}>
                <option value="free">Free</option>
                <option value="pro">Full library</option>
              </select>
            </label>
          </div>
          <label><span>Summary</span><input required value={form.summary} onChange={changeForm('summary')} /></label>
          <label><span>Prompt body</span><textarea required rows={8} value={form.body} onChange={changeForm('body')} /></label>
          <div className="form-row">
            <label><span>Tags (comma separated)</span><input value={form.tags} onChange={changeForm('tags')} /></label>
            <label><span>Display order</span><input type="number" min="0" value={form.order} onChange={changeForm('order')} /></label>
          </div>
          <label className="checkbox-line">
            <input type="checkbox" checked={form.featured} onChange={changeForm('featured')} />
            <span>Feature this prompt</span>
          </label>
          <div className="editor-actions">
            <button className="button primary" disabled={busy}>{busy ? 'Saving…' : 'Save prompt'}</button>
            <button type="button" className="button ghost" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      {loading && <div className="notice">Loading…</div>}

      {!loading && tab === 'overview' && data.stats && (
        <>
          <div className="stat-cards">
            {[
              ['Prompts', data.stats.prompts],
              ['Free prompts', data.stats.freePrompts],
              ['Accounts', data.stats.users],
              ['Leads', data.stats.leads],
              ['Orders', data.stats.orders],
              ['Revenue (demo)', `S$${(data.stats.revenueCents / 100).toFixed(0)}`],
            ].map(([label, value]) => (
              <div className="stat-card" key={label}>
                <span>{label}</span><strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className="admin-tables">
            <div className="table-card">
              <h3>Recent leads</h3>
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Source</th><th>Date</th></tr></thead>
                <tbody>
                  {data.recentLeads.length === 0 && <tr><td colSpan="4" className="muted">No leads yet.</td></tr>}
                  {data.recentLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td>{lead.name || '—'}</td><td>{lead.email}</td><td>{lead.source}</td>
                      <td>{dateLabel(lead.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-card">
              <h3>Recent orders</h3>
              <table>
                <thead><tr><th>Receipt</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {data.recentOrders.length === 0 && <tr><td colSpan="4" className="muted">No orders yet.</td></tr>}
                  {data.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.receipt || order.providerOrderId}</td>
                      <td>S${(order.amount / 100).toFixed(2)}</td><td>{order.status}</td>
                      <td>{dateLabel(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!loading && tab === 'prompts' && (
        <div className="table-card wide">
          <table>
            <thead><tr><th>Title</th><th>Category</th><th>Access</th><th></th></tr></thead>
            <tbody>
              {(data.prompts || []).map((prompt) => (
                <tr key={prompt.id}>
                  <td><strong>{prompt.title}</strong><br /><span className="muted">/{prompt.slug}</span></td>
                  <td>{prompt.category}</td>
                  <td><span className={`badge ${prompt.access === 'pro' ? 'gold' : ''}`}>{prompt.access}</span></td>
                  <td className="row-actions">
                    <button className="icon-button" onClick={() => editPrompt(prompt)} aria-label="Edit"><Edit2 size={15} /></button>
                    <button className="icon-button danger" onClick={() => deletePrompt(prompt)} aria-label="Delete"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'leads' && (
        <div className="table-card wide">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Interest</th><th>Source</th><th>Date</th></tr></thead>
            <tbody>
              {(data.leads || []).length === 0 && <tr><td colSpan="6" className="muted">No leads yet.</td></tr>}
              {(data.leads || []).map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name || '—'}</td><td>{lead.email}</td><td>{lead.role || '—'}</td>
                  <td>{lead.interest || '—'}</td><td>{lead.source}</td><td>{dateLabel(lead.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'orders' && (
        <div className="table-card wide">
          <table>
            <thead><tr><th>Receipt</th><th>User</th><th>Amount</th><th>Status</th><th>Provider</th><th>Date</th></tr></thead>
            <tbody>
              {(data.orders || []).length === 0 && <tr><td colSpan="6" className="muted">No orders yet.</td></tr>}
              {(data.orders || []).map((order) => (
                <tr key={order.id}>
                  <td>{order.receipt || order.providerOrderId}</td><td>{order.userId}</td>
                  <td>S${(order.amount / 100).toFixed(2)}</td><td>{order.status}</td>
                  <td>{order.provider}</td><td>{dateLabel(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
