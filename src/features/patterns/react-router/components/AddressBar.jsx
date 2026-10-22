/**
 * AddressBar - a fake browser address bar that shows the CURRENT URL.
 *
 * useLocation() returns the current location object and re-renders this
 * component whenever the URL changes:
 *   { pathname: '/patterns/react-router/users/2', search: '?q=hi', hash: '', state: null, key: 'x7f2a' }
 */
import { useLocation } from 'react-router-dom';
import { Globe, Lock } from 'lucide-react';

export default function AddressBar() {
  const { pathname, search, hash } = useLocation();

  return (
    <div className="rr-address" aria-label="Current URL">
      <Lock size={13} className="rr-address-lock" />
      <Globe size={13} className="muted" />
      <span className="rr-address-url">
        <span className="muted">localhost</span>
        <span className="rr-address-path">{pathname}</span>
        {search && <span className="rr-address-search">{search}</span>}
        {hash && <span className="rr-address-hash">{hash}</span>}
      </span>
    </div>
  );
}
