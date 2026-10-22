/**
 * ErrorBoundary - catches errors thrown while rendering its children.
 * ----------------------------------------------------------------------------
 * Error boundaries are the ONE thing that still requires a CLASS component:
 * there is no hook equivalent of getDerivedStateFromError / componentDidCatch.
 * (Many teams use the small "react-error-boundary" package, which wraps this
 * same class for you. Writing it yourself shows how it works.)
 *
 * Usage:
 *   <ErrorBoundary
 *     fallback={({ error, reset }) => <ErrorFallback error={error} onRetry={reset} />}
 *     onError={(error, info) => logToServer(error, info.componentStack)}
 *     onReset={() => setCount(0)}
 *     resetKeys={[userId]}          // auto-reset when any of these values change
 *   >
 *     <Profile userId={userId} />
 *   </ErrorBoundary>
 *
 * Catches errors in: rendering, lifecycle methods, constructors of children.
 * Does NOT catch:    event handlers, setTimeout / promises (async code),
 *                    errors in the boundary itself, server-side rendering.
 * ----------------------------------------------------------------------------
 */
import { Component } from 'react';
import ErrorFallback from './ErrorFallback';

// Did any reset key change? (compares arrays item by item)
const keysChanged = (a = [], b = []) => a.length !== b.length || a.some((item, i) => !Object.is(item, b[i]));

export default class ErrorBoundary extends Component {
  // 1. State: the caught error (null = everything is fine)
  state = { error: null };

  // 2. Called DURING RENDER when a child throws.
  //    Return the new state -> the next render shows the fallback UI.
  static getDerivedStateFromError(error) {
    return { error };
  }

  // 3. Called AFTER the fallback is on screen - the place for side effects
  //    such as logging to a service (Sentry, LogRocket, your API...).
  componentDidCatch(error, info) {
    // info.componentStack tells you WHICH components were rendering
    this.props.onError?.(error, info);
  }

  // 4. Automatic reset: if the resetKeys changed (e.g. the user picked a
  //    different profile) give the children another chance.
  componentDidUpdate(prevProps) {
    if (this.state.error !== null && keysChanged(prevProps.resetKeys, this.props.resetKeys)) {
      this.reset();
    }
  }

  // Manual reset (e.g. a "Try again" button). Arrow function = `this` is bound.
  reset = () => {
    this.props.onReset?.();
    this.setState({ error: null }); // render the children again
  };

  render() {
    const { error } = this.state;
    const { fallback, children } = this.props;

    if (error !== null) {
      // fallback can be a function (gets error + reset) or a ready element
      if (typeof fallback === 'function') return fallback({ error, reset: this.reset });
      if (fallback) return fallback;
      return <ErrorFallback error={error} onRetry={this.reset} />; // default UI
    }

    return children; // no error: render normally
  }
}
