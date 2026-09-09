import  { Component, type ErrorInfo, type  ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = (): void => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleGoHome = (): void => {
    window.location.href = '/';
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isChunkLoadError = 
        this.state.error?.name === 'ChunkLoadError' ||
        this.state.error?.message?.includes('Loading chunk') ||
        this.state.error?.message?.includes('Failed to fetch dynamically imported module');

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-100 p-6 text-center">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} />
            </div>

            <h2 className="text-xl font-bold text-slate-800 mb-2">
              {isChunkLoadError ? 'New Version Available' : 'Something went wrong'}
            </h2>

            <p className="text-sm text-slate-600 mb-6">
              {isChunkLoadError
                ? 'A new version of the app has been deployed. Please refresh the page to get the latest update.'
                : this.state.error?.message || 'An unexpected error occurred while rendering this view.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw size={16} className="mr-2" />
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                Reload Page
              </button>
            </div>

            <button
              onClick={this.handleGoHome}
              className="inline-flex items-center justify-center text-xs text-slate-500 hover:text-slate-700 mt-2 cursor-pointer"
            >
              <Home size={14} className="mr-1" />
              Return to Home Page
            </button>

            {import.meta.env.DEV && this.state.errorInfo && (
              <details className="mt-6 text-left bg-slate-100 p-3 rounded text-xs overflow-auto max-h-40 border border-slate-200">
                <summary className="cursor-pointer font-mono font-bold text-red-600 mb-1">
                  Stack Trace (Dev Mode)
                </summary>
                <pre className="whitespace-pre-wrap text-slate-700">
                  {this.state.error?.toString()}
                  {'\n'}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;