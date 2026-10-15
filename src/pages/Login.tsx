import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useShop();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (email === 'admin@velora.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setErrorMessage(res.message || 'Invalid email or password');
    }
  };

  return (
    <div className="bg-gray-50 min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-sm shadow-xs text-left">
        
        <div className="text-center mb-8">
          <span className="font-serif text-3xl font-bold tracking-widest text-gray-900 block mb-2">
            VELORA
          </span>
          <h2 className="font-serif text-2xl font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Sign in to access your wishlist, saved addresses, and order history.
          </p>
        </div>

        {/* Admin Quick Fill Helper */}
        <div className="mb-6 bg-gray-50 p-3 border border-gray-200 rounded-sm text-xs text-gray-600 flex items-center justify-between gap-3">
          <div>
            <span className="font-bold text-gray-900 text-[11px] block">Admin Portal Access</span>
            <span className="text-[10px] text-gray-500">Click to auto-fill admin login credentials</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail('admin@velora.com');
              setPassword('Admin@123');
            }}
            className="py-1.5 px-3 bg-gray-900 text-white rounded-xs text-[11px] font-semibold hover:bg-black transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            Fill Admin Login
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 bg-red-50 text-red-600 text-xs p-3 rounded-xs border border-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900 focus:bg-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-gray-700">Password</label>
              <a href="#forgot" className="text-[11px] text-blue-600 hover:underline">Forgot Password?</a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white font-semibold text-xs py-3 uppercase tracking-widest hover:bg-gray-800 transition-colors rounded-sm shadow-sm mt-4 disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-gray-900 hover:underline">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
};
