// ErrorBoundary.jsx

import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any child components and re-renders with an error message
    this.setState({ hasError: true, error: error, errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Render error UI
      return (
        <div>
          <h2>Something went wrong</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    // Render children if there's no error
    return this.props.children;
  }
}

export default ErrorBoundary;
