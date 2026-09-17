import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Investment Planner error:', error);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="error-screen">
        <section className="card error-card" role="alert" aria-labelledby="error-title">
          <p className="eyebrow">Something went wrong</p>
          <h1 id="error-title">We couldn’t render this plan.</h1>
          <p>Please reload the app. Your saved scenarios remain in your browser storage.</p>
          <button type="button" className="primary-button" onClick={this.handleReload}>Reload planner</button>
        </section>
      </main>
    );
  }
}
