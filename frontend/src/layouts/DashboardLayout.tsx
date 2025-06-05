'use client';

import { Box } from '@chakra-ui/react';
import Sidebar from '@/components/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Box display="flex" minH="100vh">
      <Sidebar />
      <Box 
        as="main" 
        flex="1" 
        p={4}
        bg="gray.50"
        _dark={{
          bg: 'gray.800'
        }}
      >
        {children}
      </Box>
    </Box>
  );
} 