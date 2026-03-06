import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Vocentra Component Error:", error, errorInfo);
    // In a real app we would log to Sentry here:
    // Sentry.captureException(error)
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "2rem",
            background: "rgba(255, 60, 60, 0.1)",
            border: "1px solid var(--danger)",
            borderRadius: 12,
            color: "var(--text)",
            textAlign: "center",
            margin: "1rem 0",
          }}
        >
          <h3 style={{ color: "var(--danger)", marginBottom: "1rem" }}>
            Something went wrong
          </h3>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              marginBottom: "1rem",
            }}
          >
            We encountered an unexpected issue while rendering this panel.
          </p>
          <button
            className="btn-ghost"
            onClick={() => this.setState({ hasError: false })}
            style={{ fontSize: "0.8rem" }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
