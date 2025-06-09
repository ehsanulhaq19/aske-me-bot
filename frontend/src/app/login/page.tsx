'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Slider from '@/components/slider/Slider';
import useStore from '@/store';
import { setToken, getToken } from '@/services/security';
import { authApi } from '@/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login(formData);
      const { user, access_token } = response;
      
      setUser({
        id: user.id.toString(),
        name: user.name,
        email: user.email
      });

      setToken(access_token);
      router.replace('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-slider-section">
        <Slider />
      </div>
      
      <div className="login-form-section">
        <div className="login-form-wrapper">
          <div className="login-logo">
            <Image
              src="/static/images/logo.svg"
              alt="Logo"
              width={150}
              height={50}
              priority
            />
          </div>
          <h1 className="login-form-title">Welcome Back</h1>
          <p className="login-form-subtitle">Sign in to continue to your account</p>
          
          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
                {error}
              </div>
            )}
            
            <div className="login-input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="login-input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="login-submit-button"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}