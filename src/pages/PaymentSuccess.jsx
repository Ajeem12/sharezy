import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getPaymentStatus } from "../redux/features/paymentStatusSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const PaymentSuccess = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.paymentStatus);

  useEffect(() => {
    if (id) {
      dispatch(getPaymentStatus(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading payment status...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load payment details.
      </div>
    );
  }

  // ✅ Extract payment data safely
  const payment = data || {};
  const paymentDetails = payment.paymentDetails?.[0];

  const isSuccess = payment.state === "COMPLETED";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-xl text-center p-8 sm:p-10 max-w-md w-full"
      >
        {/* Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          {isSuccess ? (
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          ) : (
            <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
          )}
        </motion.div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          {isSuccess ? "Payment Successful!" : "Payment Failed"}
        </h1>
        <p className="text-gray-600 mb-6">
          {isSuccess
            ? "Your booking has been confirmed successfully."
            : payment?.errorContext?.description ||
              "Something went wrong during payment."}
        </p>

        {/* Payment Details Card */}
        <div className="text-left bg-gray-50 rounded-xl p-5 border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Payment Summary
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <strong>Order ID:</strong> {payment.orderId || "—"}
            </li>
            <li>
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  isSuccess ? "text-green-600" : "text-red-600"
                }`}
              >
                {payment.state}
              </span>
            </li>
            <li>
              <strong>Amount:</strong> ₹{payment.amount}
            </li>
            {paymentDetails && (
              <>
                <li>
                  <strong>Payment Mode:</strong> {paymentDetails.paymentMode}
                </li>
                <li>
                  <strong>Transaction ID:</strong>{" "}
                  {paymentDetails.transactionId}
                </li>
              </>
            )}
            {payment.errorContext && (
              <>
                <li>
                  <strong>Error Code:</strong>{" "}
                  {payment.errorContext.errorCode || "—"}
                </li>
                <li>
                  <strong>Detailed Code:</strong>{" "}
                  {payment.errorContext.detailedErrorCode || "—"}
                </li>
                <li>
                  <strong>Source:</strong> {payment.errorContext.source || "—"}
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard/booked"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            View Booking
          </Link>

          <Link
            to="/rides"
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Book Another Ride
          </Link>
        </div>

        {/* Support */}
        <p className="text-xs text-gray-400 mt-6">
          Need help?{" "}
          <a href="#" className="text-[#278BB1] hover:underline">
            Contact Support
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
