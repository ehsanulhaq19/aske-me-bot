import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useLogout } from '../hooks/useLogout';
import axiosInstance from '../api/axios';
import '../static/styles/pages/error-boundary.scss';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public componentDidMount() {
    axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Store error in state to trigger logout
          this.setState({ hasError: true, error: new Error('Unauthorized') });
        }
        return Promise.reject(error);
      }
    );
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  const { logout } = useLogout();

  React.useEffect(() => {
    const isUnauthorized = error?.message === 'Unauthorized' || 
                          error?.message?.includes('401') ||
                          error?.name === 'AxiosError' && error?.response?.status === 401;
    
    if (isUnauthorized) {
      logout();
    }
  }, [error, logout]);

  return (
    <div className="error-boundary__container">
      <div className="error-boundary__content">
        <h1 className="error-boundary__title">Something went wrong</h1>
        <p className="error-boundary__message">
          {error?.message || 'We\'re sorry, but there was an error processing your request.'}
        </p>
        <button
          onClick={logout}
          className="error-boundary__button"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
};

export default ErrorBoundary; 