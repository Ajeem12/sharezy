import React from "react";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

const ErrorMessage = ({ message, onRetry, title = "Something went wrong" }) => {
  return (
    <div
      role="alert"
      className="max-w-xl mx-auto bg-red-50 border border-red-300 rounded-lg p-5 shadow-md flex items-start gap-4 animate-fade-in"
    >
      <FiAlertCircle className="text-red-600 w-6 h-6 flex-shrink-0 mt-1" />
      <div className="flex-1">
        <h2 className="text-red-800 font-semibold text-lg">{title}</h2>
        <p className="text-red-700 mt-1 text-sm">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 border border-red-300 text-red-800 text-sm font-medium rounded hover:bg-red-200 hover:text-red-900 transition-colors duration-200"
          >
            <FiRefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
