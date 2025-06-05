'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Slider from '@/components/slider/Slider';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your login logic here
  };

  return (
    <div className="login-container">
      <div className="login-slider-section">
        <Slider />
      </div>
      
      <div className="login-form-section">
        <div className="login-form-wrapper">
          <h1 className="login-form-title">Welcome Back</h1>
          <p className="login-form-subtitle">Sign in to continue to your account</p>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                required
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
              />
            </div>

            <button type="submit" className="login-submit-button">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}