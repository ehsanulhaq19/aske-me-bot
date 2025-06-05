'use client';

import { ChakraProvider as ChakraUIProvider } from '@chakra-ui/react';

const theme = {
  styles: {
    global: {
      body: {
        bg: 'purple.50', // Light purple background
      },
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#F5F3FF',  // Very light purple
      100: '#EDE9FE',
      200: '#DDD6FE',
      300: '#C4B5FD',
      400: '#A78BFA',
      500: '#8B5CF6',
      600: '#7C3AED',
      700: '#6D28D9',
      800: '#5B21B6',
      900: '#4C1D95',
    },
  },
};

export function ChakraProvider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraUIProvider theme={theme}>
      {children}
    </ChakraUIProvider>
  );
} 