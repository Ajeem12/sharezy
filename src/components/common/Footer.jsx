import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaShieldAlt,
  FaFileAlt,
  FaQuestionCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-400">Sharezy</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Reliable rides at your fingertips. Anytime. Anywhere. Join
              thousands of satisfied customers today.
            </p>

            <div className="flex space-x-4 pt-2">
              <Link
                to="#"
                className="bg-gray-700 hover:bg-blue-500 p-2 rounded-full transition-colors"
              >
                <FaFacebookF className="text-white text-sm" />
              </Link>
              <Link
                to="#"
                className="bg-gray-700 hover:bg-blue-400 p-2 rounded-full transition-colors"
              >
                <FaTwitter className="text-white text-sm" />
              </Link>
              <Link
                to="#"
                className="bg-gray-700 hover:bg-pink-500 p-2 rounded-full transition-colors"
              >
                <FaInstagram className="text-white text-sm" />
              </Link>
              <Link
                to="#"
                className="bg-gray-700 hover:bg-blue-600 p-2 rounded-full transition-colors"
              >
                <FaLinkedinIn className="text-white text-sm" />
              </Link>
              <Link
                to="#"
                className="bg-gray-700 hover:bg-red-600 p-2 rounded-full transition-colors"
              >
                <FaYoutube className="text-white text-sm" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2" /> Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="flex items-center text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>{" "}
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/publish"
                  className="flex items-center text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>{" "}
                  Publish a Ride
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="flex items-center text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>{" "}
                  Search Rides
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="flex items-center text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>{" "}
                  Become a Driver
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
              <FaQuestionCircle className="mr-2" /> Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/help"
                  className="flex items-center text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>{" "}
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/safety"
                  className="flex items-center text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>{" "}
                  Safety
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="flex items-center text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>{" "}
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="flex items-center text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>{" "}
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="flex items-center text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>{" "}
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="flex items-center text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>{" "}
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
              <FaPhoneAlt className="mr-2" /> Contact Us
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-2 text-sm flex-shrink-0" />
                <span>
                  119, Camp 1 Shanti Para, Supela Bhilai,
                  <br />
                  Durg, Chhattisgarh — 490023
                </span>
              </li>
              <li className="flex items-center">
                <a
                  href="tel:+919302838191"
                  className="flex items-center hover:text-blue-400 transition-colors"
                >
                  <FaPhoneAlt className="mr-2 text-sm" />
                  <span>+91 9302838191</span>
                </a>
              </li>

              <li className="flex items-center">
                <a
                  href="mailto:support@sharezy.com"
                  className="flex items-center hover:text-blue-400 transition-colors"
                >
                  <FaEnvelope className="mr-2 text-sm" />
                  <span>support@sharezy.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-10 mb-6"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div className="flex items-center mb-4 md:mb-0">
            <FaShieldAlt className="mr-2" />
            <span>100% Secure Payments</span>
          </div>
          <div className="flex items-center">
            <FaFileAlt className="mr-2" />
            <span>
              &copy; {new Date().getFullYear()} Design & Maintained by{" "}
              <span>|</span>{" "}
              <Link to="https://www.ayodhyawebosoft.com/">
                Ayodhya Webosoft Private Limited
              </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
