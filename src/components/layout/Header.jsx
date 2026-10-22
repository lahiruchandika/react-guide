/**
 * Header - top bar with breadcrumb, mobile menu button and theme toggle.
 *
 * Reads the theme from context with the custom hook useTheme() -
 * no props needed, even though the state lives in ThemeProvider (App.jsx).
 */
import { Link, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { TOPIC_GROUPS, getTopic } from '@/data/topics';
import './Header.css';

export default function Header({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  // Build a breadcrumb from the URL: "/hooks/use-state" -> Hooks / useState
  const [groupId, topicId] = pathname.split('/').filter(Boolean);
  const group = TOPIC_GROUPS.find((g) => g.id === groupId);
  const topic = getTopic(topicId);

  return (
    <header className="header">
      <button className="header-menu" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={20} />
      </button>

      <div className="breadcrumb">
        <Link to="/">Home</Link>
        {group && <span>/ {group.title}</span>}
        {topic && <strong>/ {topic.title}</strong>}
      </div>

      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
      </button>
    </header>
  );
}
