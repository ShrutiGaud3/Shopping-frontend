import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { register } = useShop();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const res = await register(formData.name, formData.email, formData.phone, formData.password);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setErrorMessage(res.message || 'Registration failed');
    }
  };

  return (
    <div className="bg-gray-50 min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-sm shadow-xs text-left">
        
        <div className="text-center mb-8">
          <span className="font-serif text-3xl font-bold tracking-widest text-[#183812] block mb-2">
            WEAVERA
          </span>
          <h2 className="font-serif text-2xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Join the Weavera ethnic fashion community for exclusive member benefits.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 bg-red-50 text-red-600 text-xs p-3 rounded-xs border border-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              required
              placeholder="Enter 10-digit mobile number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="Create a password (min. 6 characters)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 rounded-sm px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white font-semibold text-xs py-3 uppercase tracking-widest hover:bg-gray-800 transition-colors rounded-sm shadow-sm mt-4 disabled:opacity-50"
          >
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-600">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-gray-900 hover:underline">
            Login here
          </Link>
        </div>

      </div>
    </div>
  );
};
