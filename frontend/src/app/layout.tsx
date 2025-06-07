'use client';

import { ChakraProvider } from '@/providers/ChakraProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import '@/static/styles/main.scss';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ChakraProvider>
      </body>
    </html>
  );
} 