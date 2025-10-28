import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSmartphone, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import SharezyLoader from "../components/SharezyLoader";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
const Login = () => {
  const [mobile, setMobile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { requestLogin } = useAuth();
  const from = localStorage.getItem('lastVisitedPath') || '/';

  

  const isValidMobile = (input) => /^[6-9]\d{9}$/.test(input);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidMobile(mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsSubmitting(true);
    const result = await requestLogin(mobile);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Login request successful! Please verify OTP.");
      navigate("/verify", {
        state: {
          identifier: mobile, // Pass the mobile number
          mobile: mobile, // You can pass it as a separate field too
          from,
        },
      });
    } else {
      setError(result.message);
       console.log( result.message)
      toast.error(result.message || "Something went wrong!");
    }
  };

 
  
  

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen  flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 to-gray-50">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-30">
          <SharezyLoader />
        </div>
      )}

      {/* Left image section */}
      <motion.div
        className="hidden md:flex  relative w-full lg:w-1/2 h-64 lg:h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-blue-800/90  flex items-center justify-center p-8">
          <motion.div
            className="text-center px-6 max-w-2xl"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h2 className="text-white text-4xl md:text-5xl font-bold leading-tight">
              Ride Safe, Ride Smart
            </h2>
            <p className="mt-6 text-blue-100 text-xl max-w-lg leading-relaxed">
              Your trusted partner for fast, affordable, and secure rides across
              the city.
            </p>
            <div className="mt-10 flex justify-center">
              <div className="h-1 w-24 bg-blue-400 rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-2  min-h-[calc(100vh-64px)] lg:py-0">
        <motion.div
          className="w-full max-w-md bg-white shadow-2xl p-6 rounded-3xl border border-gray-100"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <motion.h2
              className="text-4xl font-bold text-gray-800 mb-3"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Welcome Back
            </motion.h2>
            <p className="text-gray-500 text-lg">
              Enter your mobile number to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSmartphone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="mobile"
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-gray-50 focus:bg-white"
                  disabled={isSubmitting}
                />
              </div>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Sending OTP..."
              ) : (
                <>
                  <span>Send OTP</span>
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </motion.button>

            <motion.div
              className="text-center text-sm text-gray-500 mt-8"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
            >
           <p className="mt-6 text-center text-sm text-blue-800 pb-4">
  Get started - <Link to="/signup" className="text-blue-900 font-medium underline">Register for free</Link>
</p>
              By continuing, you agree to our{" "}
              <a
                href="#"
                className="text-blue-600 hover:underline font-medium transition-colors"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-blue-600 hover:underline font-medium transition-colors"
              >
                Privacy Policy
              </a>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
)};
export default Login