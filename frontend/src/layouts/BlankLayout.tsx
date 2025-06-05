'use client';

import { Box, HStack, Image, Heading } from '@chakra-ui/react';

interface BlankLayoutProps {
  children: React.ReactNode;
}

export default function BlankLayout({ children }: BlankLayoutProps) {
  return (
    <Box 
      minH="100vh" 
      display="flex" 
      flexDirection="column"
      bg="gray.50"
      _dark={{
        bg: 'gray.800'
      }}
    >
      <HStack spacing={2} p={4}>
        <Image src="/static/images/logo-white.svg" alt="Ask Me Bot Logo" boxSize="40px" />
        <Heading size="md" color="white.600" letterSpacing="-0.5px">AskMe Bot</Heading>
      </HStack>
      
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          w="full"
          maxW="md"
          p={8}
          bg="white"
          _dark={{
            bg: 'gray.700'
          }}
          borderRadius="lg"
          boxShadow="lg"
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
} 