import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import FallBack from '../../pages/ErrorBoundry/FallBack';

export const ErrorBoundary = ({ children, onReset }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={FallBack}
      onReset={onReset}
      onError={(error, errorInfo) => {
        console.log('error', errorInfo);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};
