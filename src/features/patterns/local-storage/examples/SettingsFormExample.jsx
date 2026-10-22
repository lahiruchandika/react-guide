/**
 * SettingsFormExample - a settings form saved to localStorage on "Save".
 * ----------------------------------------------------------------------------
 * Two copies of the settings:
 *   saved  - persisted with useLocalStorage (what is stored right now)
 *   draft  - normal useState, edited by the form (not saved until you click)
 *
 * Comparing them tells us if there are unsaved changes ("dirty" form).
 * This is how real settings pages work: edit freely, then Save or Discard.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Save, Undo2 } from 'lucide-react';
import { Badge, Button, Input } from '@/components/ui';
import { useLocalStorage } from '@/hooks';

const DEFAULT_SETTINGS = {
  displayName: 'React Learner',
  language: 'en',
  fontSize: 16,
  emailUpdates: true,
};

const GREETINGS = { en: 'Hello', es: 'Hola', fr: 'Bonjour', si: 'Ayubowan' };

export default function SettingsFormExample() {
  // 1. The saved settings live in localStorage.
  const [saved, setSaved] = useLocalStorage('react-guide:settings', DEFAULT_SETTINGS);

  // 2. The draft starts as a copy of the saved settings.
  const [draft, setDraft] = useState(saved);

  // 3. Derived: are there unsaved changes? (simple deep compare via JSON)
  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  // One change handler for every field: uses the input's name attribute.
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : type === 'range' ? Number(value) : value;
    setDraft((d) => ({ ...d, [name]: nextValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(draft); // 4. Save -> useLocalStorage writes it to storage
  };

  return (
    <div className="grid-2">
      <form className="stack" onSubmit={handleSubmit}>
        <Input label="Display name" name="displayName" value={draft.displayName} onChange={handleChange} />

        <div className="field">
          <label className="field-label" htmlFor="ls-language">Language</label>
          <select id="ls-language" className="select" name="language" value={draft.language} onChange={handleChange}>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="si">Sinhala</option>
          </select>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="ls-font">Font size: {draft.fontSize}px</label>
          <input id="ls-font" type="range" name="fontSize" min="12" max="24" value={draft.fontSize} onChange={handleChange} />
        </div>

        <label className="row small">
          <input type="checkbox" name="emailUpdates" checked={draft.emailUpdates} onChange={handleChange} />
          Send me email updates
        </label>

        <div className="row">
          <Button type="submit" icon={<Save size={14} />} disabled={!isDirty}>Save</Button>
          <Button variant="secondary" icon={<Undo2 size={14} />} onClick={() => setDraft(saved)} disabled={!isDirty}>
            Discard
          </Button>
          <Button variant="ghost" onClick={() => setDraft(DEFAULT_SETTINGS)}>Defaults</Button>
          {/* Status badge reacts to the derived isDirty value */}
          <Badge tone={isDirty ? 'warning' : 'success'}>{isDirty ? 'Unsaved changes' : 'All changes saved'}</Badge>
        </div>
      </form>

      <div className="stack">
        {/* Live preview uses the DRAFT, so you see changes before saving */}
        <div className="ls-preview" style={{ fontSize: draft.fontSize }}>
          <strong>{GREETINGS[draft.language]}, {draft.displayName || 'stranger'}!</strong>
          <p className="muted">This preview uses your draft settings.</p>
          <Badge tone={draft.emailUpdates ? 'success' : 'neutral'}>
            {draft.emailUpdates ? 'Email updates on' : 'Email updates off'}
          </Badge>
        </div>
        <div className="box">
          <span className="box-label">Stored in localStorage (saved)</span>
          <pre className="ls-pre">{JSON.stringify(saved, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
