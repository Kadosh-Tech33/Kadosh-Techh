import { Component } from 'react';

// Class component is required here — React has no hook equivalent for
// componentDidCatch/getDerivedStateFromError yet. Scoped tightly around
// the Hyperspeed canvas so a WebGL failure (unsupported browser, lost
// context, driver issue) degrades to the static navy fallback instead of
// taking the rest of the Hero — or the app — down with it.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[Hyperspeed] falling back to static background:', error, info);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
