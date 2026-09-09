import { lazy,  type ComponentType } from 'react';

/**
 * Enterprise React.lazy wrapper that retries fetching chunks on transient network failures
 * or new deployment chunk filename changes before throwing to ErrorBoundary.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  maxRetries = 2,
  interval = 1000
) {
  return lazy(() =>
    new Promise<{ default: T }>((resolve, reject) => {
      let retriesLeft = maxRetries;

      const attemptImport = () => {
        componentImport()
          .then(resolve)
          .catch((error) => {
            const isAlreadyRefreshed = sessionStorage.getItem('retry_lazy_reload');

            if (retriesLeft > 0) {
              retriesLeft -= 1;
              setTimeout(attemptImport, interval);
            } else if (!isAlreadyRefreshed) {
              sessionStorage.setItem('retry_lazy_reload', 'true');
              window.location.reload();
            } else {
              sessionStorage.removeItem('retry_lazy_reload');
              reject(error);
            }
          });
      };

      attemptImport();
    })
  );
}

export default lazyWithRetry;