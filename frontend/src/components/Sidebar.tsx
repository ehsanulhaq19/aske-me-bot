'use client';

import { FiHome, FiSettings, FiGrid, FiUpload, FiLogOut } from 'react-icons/fi';
import { HStack, Image, Heading } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import styles from '@/static/styles/layout/sidebar.module.css';

interface NavItemProps {
  icon: any;
  children: string;
  href: string;
}

const NavItem = ({ icon: Icon, children, href }: NavItemProps) => {
  return (
    <Link href={href} className={styles.navItem}>
      <Icon className={styles.navItemIcon} />
      <span className={styles.navItemText}>{children}</span>
    </Link>
  );
};

const Sidebar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <aside className={styles.sidebar}>
      <HStack spacing={2} mb={40} mt={4} ml={25}>
        <Image src="/static/images/logo-white.svg" alt="Ask Me Bot Logo" boxSize="40px" />
        <Heading size="md" color="blue.600" letterSpacing="-0.5px">AskMe Bot</Heading>
      </HStack>
      <nav className={styles.navContainer}>
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
        <button className={styles.logoutButton} onClick={handleLogout}>
          <FiLogOut className={styles.navItemIcon} />
          <span className={styles.navItemText}>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar; 