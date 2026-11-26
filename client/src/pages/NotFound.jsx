import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-center">
      <div className="empty-state">
        <span className="eyebrow">404</span>
        <h2>That page has sailed.</h2>
        <p>The page you were looking for is not here.</p>
        <Link to="/" className="button primary">Back to the harbour</Link>
      </div>
    </div>
  );
}
