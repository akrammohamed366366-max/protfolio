import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log real error to the console instead of showing a blank screen
    console.error('Application Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-bg text-brand-navy flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 shadow-card text-center">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-base font-semibold text-brand-navy">
                Something went wrong. Please refresh the page.
              </p>
              <p className="text-base font-semibold text-brand-navy" dir="rtl">
                حدث خطأ ما. يرجى تحديث الصفحة.
              </p>
            </div>

            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy-dark text-brand-white font-medium text-sm transition-all shadow-brand-sm cursor-pointer"
            >
              Refresh / تحديث
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
