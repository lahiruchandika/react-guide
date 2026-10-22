/**
 * ObjectStateExample
 * ----------------------------------------------------------------------------
 * Storing an OBJECT in state (a user profile) and updating it correctly.
 *
 * The golden rule: never change (mutate) state directly. Always create a NEW
 * object with the spread operator (...) and pass it to the setter.
 *
 *   BAD:   profile.name = 'Ann'; setProfile(profile);   // same object -> React may skip the update
 *   GOOD:  setProfile({ ...profile, name: 'Ann' });       // new object, other fields copied
 *
 * What it demonstrates:
 *   - Spread update of one field:          { ...prev, name }
 *   - ONE generic change handler for many inputs using [e.target.name]
 *   - Updating a NESTED object:            { ...prev, address: { ...prev.address, city } }
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Input, Button, Card } from '@/components/ui';
import '../UseStatePage.css';

// Initial value lives outside the component so it is not re-created every render.
const INITIAL_PROFILE = {
  name: 'Sam Rivera',
  email: 'sam@example.com',
  role: 'Frontend developer',
  address: { city: 'Lisbon', country: 'Portugal' },
};

export default function ObjectStateExample() {
  // 1. One state variable holding a whole object.
  const [profile, setProfile] = useState(INITIAL_PROFILE);

  // 2. Generic handler: the input's `name` attribute says which field to update.
  //    [e.target.name] is a "computed property name".
  function handleChange(e) {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value })); // copy everything, override one field
  }

  // 3. Nested objects must be copied at EVERY level you change.
  function handleAddressChange(e) {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev, // copy top level
      address: { ...prev.address, [name]: value }, // copy the nested object, override one field
    }));
  }

  return (
    <div className="grid-2">
      <div className="stack">
        <div className="grid-2 us-tight">
          <Input label="Name" name="name" value={profile.name} onChange={handleChange} />
          <Input label="Email" name="email" value={profile.email} onChange={handleChange} />
        </div>
        <Input label="Role" name="role" value={profile.role} onChange={handleChange} />
        <div className="grid-2 us-tight">
          <Input label="City (nested)" name="city" value={profile.address.city} onChange={handleAddressChange} />
          <Input label="Country (nested)" name="country" value={profile.address.country} onChange={handleAddressChange} />
        </div>
        <div>
          <Button variant="secondary" size="sm" onClick={() => setProfile(INITIAL_PROFILE)}>
            Reset profile
          </Button>
        </div>
      </div>

      <Card title="Current state object">
        {/* JSON.stringify lets us SEE the whole state object update live */}
        <pre className="us-json">{JSON.stringify(profile, null, 2)}</pre>
      </Card>
    </div>
  );
}
