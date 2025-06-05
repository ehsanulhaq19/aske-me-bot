'use client';

import { Box, HStack, Image, Heading } from '@chakra-ui/react';
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
        <HStack spacing={2} mb={6}>
          <Image src="/static/images/logo.svg" alt="Ask Me Bot Logo" boxSize="40px" />
          <Heading size="md" color="blue.600" letterSpacing="-0.5px">AskMe Bot</Heading>
        </HStack>
        {children}
      </Box>
    </Box>
  );
} 