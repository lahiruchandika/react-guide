/**
 * useWindowSize - tracks the browser window's width and height.
 *
 * Usage:
 *   const { width, height } = useWindowSize();
 *   const isMobile = width < 760;
 *
 * Shows the classic "subscribe in an effect, unsubscribe in the cleanup"
 * pattern, wrapped in a hook so components don't have to repeat it.
 */
import { useEffect, useState } from 'react';

// Small helper that reads the current size.
function getSize() {
  return { width: window.innerWidth, height: window.innerHeight };
}

export function useWindowSize() {
  // 1. Lazy initial state: read the size once, on the first render.
  const [size, setSize] = useState(getSize);

  useEffect(() => {
    // 2. Subscribe: update state whenever the window is resized.
    const handleResize = () => setSize(getSize());
    window.addEventListener('resize', handleResize);

    // 3. Cleanup: unsubscribe when the component unmounts
    //    (otherwise listeners would pile up and leak memory).
    return () => window.removeEventListener('resize', handleResize);
  }, []); // [] = subscribe once, on mount

  return size;
}
