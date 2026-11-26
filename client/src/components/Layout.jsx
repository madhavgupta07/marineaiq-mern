import { useState } from 'react';
import { Anchor, ArrowUpRight, Menu, X } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const onLogout = async () => {
    await logout();
    close();
    window.location.href = '/';
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container nav">
          <Link to="/" className="brand" onClick={close}>
            <span className="brand-mark">
              <Anchor size={18} strokeWidth={2.2} />
            </span>
            Marine<strong>AI</strong>Q
          </Link>

          <button
            className="nav-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav className={`nav-links ${open ? 'is-open' : ''}`}>
            <a href="/#services" onClick={close}>Services</a>
            <Link to="/library" onClick={close}>Prompt library</Link>
            <a href="/#approach" onClick={close}>Approach</a>
            <a href="/#safety" onClick={close}>Safety</a>
            <a href="/#contact" onClick={close}>Let’s talk</a>
            <span className="nav-spacer" />
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="button ghost small" onClick={close}>
                    Admin
                  </Link>
                )}
                <Link to="/dashboard" className="button ghost small" onClick={close}>
                  {user.name.split(' ')[0]}
                </Link>
                <button className="button outline small" onClick={onLogout}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-login" onClick={close}>Sign in</Link>
                <Link to="/register" className="button primary small" onClick={close}>
                  Create account <ArrowUpRight size={15} />
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <Link to="/" className="brand footer-brand">
              <span className="brand-mark"><Anchor size={18} /></span>
              Marine<strong>AI</strong>Q
            </Link>
            <p className="muted">Practical AI for people who know the ocean.</p>
          </div>
          <div className="footer-links">
            <a href="/#services">Services</a>
            <Link to="/library">Prompt library</Link>
            <a href="/#approach">Approach</a>
            <a href="/#contact">Contact</a>
            <Link to="/policies">Policies</Link>
          </div>
          <div className="footer-note">
            <p>Digital download · 7-day refund window · Built for professional judgement.</p>
            <p className="muted">© {new Date().getFullYear()} MarineAIQ</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
