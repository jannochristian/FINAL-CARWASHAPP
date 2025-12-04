import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const AdminLoginPage = ({ onLogin, goSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !data) {
        setError('Invalid admin credentials');
        setLoading(false);
        return;
      }

      onLogin(data);
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-gray-700 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-80px] right-[-80px] w-96 h-96 bg-gray-800 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-20 right-10 w-40 h-40 bg-gray-600 rounded-full filter blur-2xl opacity-20 animate-ping"></div>
      <div className="absolute bottom-40 left-10 w-48 h-48 bg-gray-500 rounded-full filter blur-2xl opacity-20 animate-ping"></div>

      <div className="relative z-10 bg-gray-800/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Admin Login</h2>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="w-full mb-4 px-4 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all disabled:opacity-50"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="w-full mb-4 px-4 py-3 border border-gray-600 rounded-xl bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all disabled:opacity-50"
        />

        {error && <p className="text-red-500 mb-4 text-center font-medium">{error}</p>}

        {error && <p className="text-red-500 mb-4 text-center font-medium">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl shadow-xl font-semibold hover:scale-105 transform transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-sm text-gray-300">
          Don't have an account?{' '}
          <button onClick={goSignUp} className="text-blue-600 font-semibold hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;