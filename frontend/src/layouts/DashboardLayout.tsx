'use client';

import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import Sidebar from '@/components/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
        />
      </Box>
    </Box>
  );
};

export default DashboardLayout; 