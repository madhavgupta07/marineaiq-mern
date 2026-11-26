import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Copy, Lock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function PromptDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api(`/prompts/${slug}`)
      .then((data) => active && setPrompt(data.prompt))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug, user]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (loading) return <div className="page-center"><div className="loader" /></div>;
  if (error || !prompt) {
    return (
      <div className="page-center">
        <div className="empty-state">
          <h2>Prompt not found</h2>
          <p>{error || 'This prompt may have been removed.'}</p>
          <Link to="/library" className="button primary">Back to library</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page narrow-page">
      <Link to="/library" className="back-link"><ArrowLeft size={16} /> Back to library</Link>

      <div className="detail-head">
        <span className="badge">{prompt.category}</span>
        <h1>{prompt.title}</h1>
        <p className="lead">{prompt.summary}</p>
        <div className="tag-list">
          {prompt.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>

      {prompt.unlocked ? (
        <div className="detail-body-card">
          <div className="detail-body-head">
            <span>Prompt text</span>
            <button className="button outline small" onClick={copy}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copied' : 'Copy prompt'}
            </button>
          </div>
          <pre className="detail-body">{prompt.body}</pre>
          <p className="safety-inline">
            Review every answer against your procedures, the maker’s manual and company rules before acting.
          </p>
        </div>
      ) : (
        <div className="locked-card">
          <span className="icon-box large"><Lock size={24} /></span>
          <h2>This prompt is part of the full library.</h2>
          <p>
            Create a free account to browse open prompts, or unlock all 100 with a one-time licence.
            Every answer still needs your professional filter.
          </p>
          <div className="locked-actions">
            <Link to="/checkout" className="button primary">Unlock for S$49</Link>
            <Link to="/library?access=free" className="button outline">Browse free prompts</Link>
          </div>
        </div>
      )}
    </div>
  );
}
