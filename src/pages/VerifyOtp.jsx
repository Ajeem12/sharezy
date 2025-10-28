import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SharezyLoader from "../components/SharezyLoader";
import { motion } from "framer-motion";
import { FiArrowLeft, FiRotateCw } from "react-icons/fi";
import { toast } from 'sonner';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const identifier = location.state?.identifier;
  const { mobile } = location.state || {};
  const { verifyOtp } = useAuth();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const lastVisitedPath = localStorage.getItem("lastVisitedPath") || "/";

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4) {
      setError("Please enter a 4-digit OTP");
      toast.error("Please enter a 4-digit OTP");
      return;
    }
    setIsSubmitting(true);
    setError("");
    const result = await verifyOtp(enteredOtp);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("OTP verified successfully!");
      localStorage.removeItem("lastVisitedPath");
      navigate(lastVisitedPath, { replace: true });
    } else {
      setError(result.message);
      toast.error(result.message || "Failed to verify OTP");
    }
  };

  const handleResendOtp = () => {
    console.log("Resending OTP...");
  };

  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-gray-50 px-4 py-8">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-30">
          <SharezyLoader />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-6"
          >
            <FiArrowLeft className="mr-2" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="text-center mb-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Verify OTP
              </h2>
              <p className="text-gray-600">
                We sent a 4-digit code to{" "}
                <span className="font-semibold text-blue-600">{identifier}</span>
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (inputsRef.current[index] = el)}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-16 h-16 text-center text-3xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    disabled={isSubmitting}
                  />
                ))}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-center text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="pt-2">
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className={`w-full py-4 px-4 rounded-xl font-medium text-white bg-blue-500  hover:bg-blue-600 transition-all shadow-md hover:shadow-lg ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <FiRotateCw className="animate-spin mr-2" />
                      Verifying...
                    </span>
                  ) : (
                    "Verify OTP"
                  )}
                </motion.button>
              </div>
            </form>
          </div>

          <div className="text-center mt-6">
            
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;