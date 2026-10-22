/**
 * UserContext.js
 * ----------------------------------------------------------------------------
 * A Context is like a "broadcast channel" for a part of the component tree.
 * Any component inside the provider can read the value with useContext(),
 * no matter how deep it is - no props needed in between.
 *
 * Creating it in its own file lets both the provider (ContextTree) and the
 * consumer (UserMenu) import the same object.
 *
 * The argument (null) is the default value used when there is no provider.
 * Learn more in the "useContext" lesson.
 * ----------------------------------------------------------------------------
 */
import { createContext } from 'react';

export const UserContext = createContext(null);
