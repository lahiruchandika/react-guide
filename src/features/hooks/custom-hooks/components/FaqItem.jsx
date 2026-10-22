/**
 * FaqItem - one collapsible question.
 *
 * Each FaqItem calls useToggle() itself, so every item remembers its own
 * open/closed state. The parent just renders a list of them.
 */
import { ChevronDown } from 'lucide-react';
import { useToggle } from '@/hooks';

export default function FaqItem({ question, answer }) {
  // [value, toggleFunction] - like useState, but with the toggle logic built in.
  const [isOpen, toggleOpen] = useToggle(false);

  return (
    <div className={`ch-faq ${isOpen ? 'is-open' : ''}`}>
      <button type="button" className="ch-faq-question" onClick={toggleOpen} aria-expanded={isOpen}>
        {question}
        <ChevronDown size={16} className="ch-faq-chevron" />
      </button>
      {/* Conditional rendering: the answer exists only while open */}
      {isOpen && <p className="ch-faq-answer">{answer}</p>}
    </div>
  );
}
