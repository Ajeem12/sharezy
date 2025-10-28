import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center py-10 px-5">
      <div className="bg-white shadow-2xl rounded-2xl p-8 sm:p-10 max-w-md w-full border border-gray-100">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
          Contact <span className="text-blue-500">Us</span>
        </h2>

        <div className="space-y-6 ">
          {/* Address */}
          <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl hover:bg-blue-100 transition-colors">
            <div className="bg-blue-600 text-white p-3 rounded-full">
              <FaMapMarkerAlt size={18} />
            </div>
            <div>
              <h4 className="text-blue-700 font-semibold text-sm uppercase mb-1">
                Address
              </h4>
              <p className="text-gray-700 leading-relaxed">
                119, Camp 1 Shanti Para, Supela Bhilai,
                <br />
                Durg, Chhattisgarh — 490023
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3 bg-green-50 p-4 rounded-xl hover:bg-green-100 transition-colors">
            <div className="bg-green-600 text-white p-3 rounded-full">
              <FaPhoneAlt size={18} />
            </div>
            <div>
              <h4 className="text-green-700 font-semibold text-sm uppercase mb-1">
                Call Us
              </h4>
              <a
                href="tel:+919302838191"
                className="text-gray-800 font-medium hover:text-green-600 transition-colors"
              >
                +91 9302838191
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3 bg-purple-50 p-4 rounded-xl hover:bg-purple-100 transition-colors">
            <div className="bg-purple-600 text-white p-3 rounded-full">
              <FaEnvelope size={18} />
            </div>
            <div>
              <h4 className="text-purple-700 font-semibold text-sm uppercase mb-1">
                Email Us
              </h4>
              <a
                href="mailto:support@sharezy.com"
                className="text-gray-800 font-medium hover:text-purple-600 transition-colors"
              >
                support@sharezy.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
