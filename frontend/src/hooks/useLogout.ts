import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const router = useRouter();

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();    
      Cookies.remove('access_token');
    }
    router.replace('/login');
  };

  return { logout };
}; 