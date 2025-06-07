'use client';

import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import Sidebar from '@/components/Sidebar';

export interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
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
};

export default DashboardLayout; 