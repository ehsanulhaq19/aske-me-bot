'use client';

import { Box, VStack, Icon, Text, Button, useColorModeValue } from '@chakra-ui/react';
import { 
  FiHome, 
  FiSettings, 
  FiGrid,
  FiUpload,
  FiLogOut 
} from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface NavItemProps {
  icon: any;
  children: string;
  href: string;
}

const NavItem = ({ icon, children, href }: NavItemProps) => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  
  return (
    <Link href={href} style={{ width: '100%', textDecoration: 'none' }}>
      <Box
        p={3}
        borderRadius="md"
        _hover={{ bg: bgColor }}
        cursor="pointer"
        display="flex"
        alignItems="center"
      >
        <Icon as={icon} mr={3} />
        <Text>{children}</Text>
      </Box>
    </Link>
  );
};

const Sidebar = () => {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <Box
      w="250px"
      h="100vh"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      py={5}
      position="sticky"
      top={0}
    >
      <VStack spacing={4} align="stretch" px={4}>
        <NavItem icon={FiHome} href="/dashboard">
          Dashboard
        </NavItem>
        <NavItem icon={FiGrid} href="/widgets">
          Widgets
        </NavItem>
        <NavItem icon={FiUpload} href="/documents">
          Documents
        </NavItem>
        <NavItem icon={FiSettings} href="/profile">
          Profile Settings
        </NavItem>
        <Box flex={1} />
        <Button
          leftIcon={<Icon as={FiLogOut} />}
          variant="ghost"
          onClick={handleLogout}
          w="100%"
          justifyContent="flex-start"
        >
          Logout
        </Button>
      </VStack>
    </Box>
  );
};

export default Sidebar; 