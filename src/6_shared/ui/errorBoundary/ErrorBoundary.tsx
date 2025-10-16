import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  hideErrorPage?: boolean;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  // eslint-disable-next-line react/state-in-constructor
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;
    console.error('ERROR INFO:', error, errorInfo);
    onError?.(error, errorInfo);
  }

  public render() {
    const { hasError } = this.state;
    const { children, hideErrorPage } = this.props;

    if (hasError) {
      if (hideErrorPage) return null;

      return <h1>Sorry... An error has occurred.</h1>;
    }

    return children;
  }
}

export default ErrorBoundary;
