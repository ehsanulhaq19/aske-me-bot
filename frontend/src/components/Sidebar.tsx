'use client';

import { FiHome, FiSettings, FiGrid, FiUpload, FiLogOut } from 'react-icons/fi';
import { HStack, Image, Heading } from '@chakra-ui/react';
import Link from 'next/link';
import { useLogout } from '../hooks/useLogout';

interface NavItemProps {
  icon: any;
  children: string;
  href: string;
}

const NavItem = ({ icon: Icon, children, href }: NavItemProps) => {
  return (
    <Link href={href} className="navItem">
      <Icon className="navItemIcon" />
      <span className="navItemText">{children}</span>
    </Link>
  );
};

const Sidebar = () => {
  const { logout } = useLogout();

  const handleLogout = async () => {
    logout();
  };

  return (
    <aside className="sidebar">
      <HStack spacing={2} mb={40} mt={4} ml={25}>
        <Image src="/static/images/logo-white.svg" alt="Ask Me Bot Logo" boxSize="40px" />
        <Heading size="md" color="blue.600" letterSpacing="-0.5px">AskMe Bot</Heading>
      </HStack>
      <nav className="navContainer">
        <NavItem icon={FiHome} href="/dashboard">
          Dashboard
        </NavItem>
        <NavItem icon={FiGrid} href="/widgets">
          Widgets
        </NavItem>
        <NavItem icon={FiUpload} href="/documents">
          Documents
        </NavItem>
        {/* <NavItem icon={FiSettings} href="/profile">
          Profile Settings
        </NavItem> */}
        <button className="logoutButton" onClick={handleLogout}>
          <FiLogOut className="navItemIcon" />
          <span className="navItemText">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar; 