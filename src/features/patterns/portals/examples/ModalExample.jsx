/**
 * ModalExample - using the reusable <Modal> for two real situations.
 * ----------------------------------------------------------------------------
 *  1. A confirmation dialog ("Delete project?")
 *  2. A form dialog ("Edit profile") - the first input gets focus automatically
 *
 * Try it with the keyboard: Tab moves around INSIDE the dialog only, Escape
 * closes it, and focus returns to the button that opened it.
 * Open DevTools → Elements: the dialog is a direct child of <body>, even
 * though <Modal> is written inside this component.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Trash2, UserPen, FolderKanban } from 'lucide-react';
import { Badge, Button, Input } from '@/components/ui';
import Modal from '../components/Modal';

export default function ModalExample() {
  // Each dialog is controlled by a simple boolean (or null) in state
  const [projects, setProjects] = useState(['Website redesign', 'Mobile app', 'Marketing site']);
  const [toDelete, setToDelete] = useState(null); // project name, or null = closed
  const [profileOpen, setProfileOpen] = useState(false);

  const [profile, setProfile] = useState({ name: 'Ada Lovelace', role: 'Engineer' });
  const [draft, setDraft] = useState(profile); // edited copy, saved on submit

  const confirmDelete = () => {
    setProjects((prev) => prev.filter((p) => p !== toDelete));
    setToDelete(null); // close
  };

  const openProfile = () => {
    setDraft(profile); // start editing from the saved values
    setProfileOpen(true);
  };

  const saveProfile = (e) => {
    e.preventDefault(); // stop the real form submit / page reload
    setProfile(draft);
    setProfileOpen(false);
  };

  return (
    <div className="grid-2">
      {/* -------- Projects with delete confirmation -------- */}
      <div className="pt-panel">
        <div className="pt-panel-title">Projects</div>
        {projects.map((p) => (
          <div key={p} className="pt-list-item">
            <FolderKanban size={16} className="muted" />
            <span className="pt-grow">{p}</span>
            <Button size="sm" variant="ghost" icon={<Trash2 />} onClick={() => setToDelete(p)} aria-label={`Delete ${p}`} />
          </div>
        ))}
        {projects.length === 0 && (
          <Button size="sm" variant="secondary" onClick={() => setProjects(['Website redesign', 'Mobile app', 'Marketing site'])}>
            Restore projects
          </Button>
        )}
      </div>

      {/* -------- Profile with edit form -------- */}
      <div className="pt-panel">
        <div className="pt-panel-title">Profile</div>
        <div className="pt-profile">
          <span className="pt-avatar">{profile.name.charAt(0)}</span>
          <div>
            <strong>{profile.name}</strong>
            <div><Badge tone="info">{profile.role}</Badge></div>
          </div>
        </div>
        <Button size="sm" icon={<UserPen />} onClick={openProfile}>Edit profile</Button>
      </div>

      {/* The modals are written HERE, but render into document.body */}
      <Modal
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        title="Delete project?"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setToDelete(null)}>Cancel</Button>
            <Button variant="danger" icon={<Trash2 />} onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p>
          <strong>{toDelete}</strong> and all its tasks will be permanently removed. This can&apos;t be undone.
        </p>
      </Modal>

      <Modal open={profileOpen} onClose={() => setProfileOpen(false)} title="Edit profile">
        <form className="stack" onSubmit={saveProfile}>
          <Input label="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required />
          <Input label="Role" value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
          <div className="row pt-end">
            <Button variant="secondary" onClick={() => setProfileOpen(false)}>Cancel</Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
