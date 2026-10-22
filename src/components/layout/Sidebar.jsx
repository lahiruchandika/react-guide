/**
 * Sidebar - navigation generated from the TOPICS list.
 *
 * Shows: filtering a list with state, grouping data, and <NavLink>, which
 * automatically adds the "active" class to the link of the current page.
 */
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { TOPIC_GROUPS, TOPICS, topicPath } from '@/data/topics';
import './Sidebar.css';

export default function Sidebar({ open, onClose }) {
  const [query, setQuery] = useState('');

  // Derived data: computed from state on every render - no extra state needed.
  const visibleTopics = TOPICS.filter((t) => t.title.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <>
      {/* Dark overlay behind the drawer on small screens */}
      {open && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <Link to="/" className="brand-link">
            <img src={`${import.meta.env.BASE_URL}react.svg`} alt="" width={28} height={28} className="brand-logo" />
            <span>
              React <b>Guide</b>
            </span>
          </Link>
          <button className="sidebar-close" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-search">
          <Search size={15} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search lessons..." />
        </div>

        <nav className="sidebar-nav">
          {TOPIC_GROUPS.map((group) => {
            const items = visibleTopics.filter((t) => t.group === group.id);
            if (items.length === 0) return null; // hide empty groups while searching

            return (
              <div key={group.id} className="nav-group">
                <div className="nav-group-title">{group.title}</div>
                {items.map((topic) => (
                  <NavLink key={topic.id} to={topicPath(topic)} className="nav-link">
                    {topic.title}
                  </NavLink>
                ))}
              </div>
            );
          })}
          {visibleTopics.length === 0 && <p className="nav-empty">No lessons match "{query}"</p>}
        </nav>
      </aside>
    </>
  );
}
