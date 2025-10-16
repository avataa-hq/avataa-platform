import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  hideErrorPage?: boolean;
  fallback?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;
    console.error('ERROR INFO:', error, errorInfo);
    onError?.(error, errorInfo);
  }

  public render() {
    const { hasError, error } = this.state;
    const { children, hideErrorPage, fallback } = this.props;

    if (hasError) {
      if (hideErrorPage) return null;

      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h1 style={{ lineBreak: 'anywhere' }}>{fallback || 'An error has occurred:'}</h1>
          {error && (
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineBreak: 'anywhere' }}>
              {error.message}
            </pre>
          )}
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
