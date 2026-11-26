import { useEffect, useState } from 'react';
import { ArrowRight, Lock, Search, Unlock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../api.js';

export default function Library() {
  const location = useLocation();
  const initialAccess = new URLSearchParams(location.search).get('access') || 'all';
  const [data, setData] = useState({ prompts: [], categories: [] });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [access, setAccess] = useState(initialAccess);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);

    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (category !== 'All') params.set('category', category);
    if (access !== 'all') params.set('access', access);

    api(`/prompts?${params}`)
      .then((result) => {
        if (active) {
          setData(result);
          setError('');
        }
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [search, category, access]);

  return (
    <div className="container page">
      <div className="page-head">
        <span className="eyebrow">Prompt library</span>
        <h1>Field-ready prompts, not AI theory.</h1>
        <p className="lead">
          Each prompt gives you a clear input format, a directed output and room for your own
          professional judgement. Free prompts are open to everyone; the full library is for licensed
          users.
        </p>
      </div>

      <div className="library-toolbar">
        <div className="search-box">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, tag or topic"
            aria-label="Search prompts"
          />
        </div>
        <div className="filter-group" aria-label="Filter by category">
          {['All', ...data.categories].map((item) => (
            <button
              key={item}
              className={`chip ${category === item ? 'active' : ''}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="filter-group" aria-label="Filter by access">
          {[
            ['all', 'All prompts'],
            ['free', 'Free'],
            ['pro', 'Full library'],
          ].map(([value, label]) => (
            <button
              key={value}
              className={`chip ${access === value ? 'active' : ''}`}
              onClick={() => setAccess(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="library-meta">
        <span>{data.prompts.length} prompt{data.prompts.length === 1 ? '' : 's'}</span>
        {loading && <span className="muted">Updating…</span>}
      </div>

      {error && <div className="notice error">{error}</div>}

      {!loading && !error && data.prompts.length === 0 && (
        <div className="empty-state">
          <h3>No prompts found</h3>
          <p>Try a different search term or category.</p>
        </div>
      )}

      <div className="prompt-grid">
        {data.prompts.map((prompt) => (
          <Link className="prompt-card" to={`/library/${prompt.slug}`} key={prompt.id}>
            <div className="prompt-card-top">
              <span className="badge">{prompt.category}</span>
              {prompt.unlocked ? (
                <span className="access open"><Unlock size={13} /> Open</span>
              ) : (
                <span className="access locked"><Lock size={13} /> Licence</span>
              )}
            </div>
            <h3>{prompt.title}</h3>
            <p>{prompt.summary}</p>
            <div className="prompt-card-foot">
              <div className="tag-list">
                {prompt.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <ArrowRight size={17} />
            </div>
          </Link>
        ))}
      </div>

      <div className="library-cta">
        <div>
          <h3>Need all 100 prompts?</h3>
          <p>One licence, one payment, built for working engineers and technical superintendents.</p>
        </div>
        <Link to="/checkout" className="button primary">
          Unlock the library <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
