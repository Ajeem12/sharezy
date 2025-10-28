import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { toast } from "sonner";
import { ImSpinner2 } from 'react-icons/im'; // A spinner icon for loading

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // ✅ Loading state
  const { adminLogin } = useAuth(); // ✅ Get login function
  const navigate = useNavigate(); // for redirecting after login

  useEffect(() => {
    if (localStorage.getItem("admintoken")) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loader

    const result = await adminLogin(email, password);

    setIsLoading(false); // Hide loader

    if (result.success) {
      navigate('/admin'); 
      toast.success("Login successful! Redirecting to admin panel...");
    } else {
      toast.error(`Login failed: ${result.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Sharezy Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <span className="px-3 text-gray-500 bg-gray-100"><FaEnvelope /></span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sharezy.com"
                className="w-full px-4 py-2 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <span className="px-3 text-gray-500 bg-gray-100"><FaLock /></span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-2 ${isLoading ? 'bg-gray-400' : 'bg-blue-600'} text-white font-semibold rounded-lg hover:bg-blue-700 transition`}
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? (
              <ImSpinner2 className="animate-spin mx-auto text-lg" /> // Show spinner if loading
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          &copy; 2025 Sharezy. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
