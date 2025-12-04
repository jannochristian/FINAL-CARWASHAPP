import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const SignUpPage = ({ goLogin }) => {
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError('Fill all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', formData.email)
        .single();

      if (existingUser) {
        setError('Email already exists');
        setLoading(false);
        return;
      }

      // Insert new user
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone
          }
        ]);

      if (insertError) throw insertError;

      alert('Account created successfully! You can now login.');
      goLogin();
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Background shapes */}
      <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-gray-700 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-80px] right-[-80px] w-96 h-96 bg-gray-800 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-20 right-10 w-40 h-40 bg-gray-600 rounded-full filter blur-2xl opacity-20 animate-ping"></div>
      <div className="absolute bottom-40 left-10 w-48 h-48 bg-gray-500 rounded-full filter blur-2xl opacity-20 animate-ping"></div>

      {/* Signup Card */}
      <div className="relative z-10 bg-gray-800/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Sign Up</h2>

        <input
          placeholder="Full Name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          disabled={loading}
          className="w-full mb-3 px-4 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all disabled:opacity-50"
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          disabled={loading}
          className="w-full mb-3 px-4 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all disabled:opacity-50"
        />

        <input
          placeholder="Phone"
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          disabled={loading}
          className="w-full mb-3 px-4 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all disabled:opacity-50"
        />

        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          disabled={loading}
          className="w-full mb-3 px-4 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all disabled:opacity-50"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
          disabled={loading}
          className="w-full mb-3 px-4 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all disabled:opacity-50"
        />

        {error && <p className="text-red-500 mb-3 text-center font-medium">{error}</p>}

        <button
          onClick={handleSignUp}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl shadow-xl font-semibold hover:scale-105 transform transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p className="text-center text-sm text-gray-300">
          Already have an account?{' '}
          <button onClick={goLogin} className="text-blue-600 font-semibold hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;