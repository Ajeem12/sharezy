import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/features/registerSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // unwrap will throw if rejected, so no need for manual fulfilled match
      await dispatch(registerUser({ name, email, mobile: phone })).unwrap();

      // registration successful
      toast.success('Registration successful! Redirecting to login...');

      // Clear form fields
      setName('');
      setEmail('');
      setPhone('');

      // Navigate to login page
      navigate('/login');
    } catch (err) {
      setError(err || 'Registration failed');
      toast.error(err || 'Registration failed')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center ">
      <div className="flex flex-col md:flex-row w-full max-w-6xl rounded-2xl overflow-hidden shadow-xl">
        {/* Left Side Image */}
        <div className="md:w-1/2 hidden md:block">
          <img
            src="/car2.png"
            alt="Register"
            className="w-full h-[600px] object-cover"
          />
        </div>

        {/* Right Side Form */}
        <div className="md:w-1/2 w-full p-10 md:p-14 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-blue-900 mb-6 text-center">Register Now</h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-blue-900 mb-1">Full Name(As Per Adhaar Card Name)</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-blue-900 mb-1">Email Address(Optional)</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="number" className="block text-sm font-semibold text-blue-900 mb-1">Phone Number</label>
              <input
                type="tel"
                id="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'} text-white text-lg py-3 rounded-lg font-semibold transition-all duration-300 shadow-md`}
            >
              {loading ? 'Registering...' : 'Submit'}
            </button>
          </form>

          {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

          {/* Optional Link */}
          <p className="mt-6 text-center text-sm text-blue-800">
            Already have an account? <Link to="/login" className="text-blue-900 font-medium underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
