/**
 * The URL of this lesson. All demo links are built from it, e.g.
 *   `${LESSON_BASE}/users/2`  ->  /patterns/react-router/users/2
 *
 * The app's router (src/app/router.jsx) matches ':group/:topicId/*', so ANY
 * path that starts with this base still renders this lesson page - the
 * trailing "/*" hands the rest of the URL to the lesson's own <Routes>.
 */
export const LESSON_BASE = '/patterns/react-router';
