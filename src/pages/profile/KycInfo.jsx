// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchKyc } from "../../redux/features/profile/kycSlice";
// import { FaCheckCircle, FaFileAlt, FaUserCircle } from "react-icons/fa";

// const KycInfo = () => {
//   const dispatch = useDispatch();
//   const { data: kycData, loading, error } = useSelector((state) => state.kyc);

//   useEffect(() => {
//     dispatch(fetchKyc());
//   }, [dispatch]);

//   if (loading) {
//     return <p className="text-center text-blue-600">Loading KYC data...</p>;
//   }

//   if (error) {
//     return (
//       <p className="text-center text-red-600">Error fetching KYC: {error}</p>
//     );
//   }

//   if (!kycData) {
//     return (
//       <p className="text-center text-gray-500">No KYC data submitted yet.</p>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-4 sm:p-6">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
//           <FaCheckCircle className="text-green-600 text-3xl" />
//         </div>
//         <h1 className="text-2xl font-bold text-gray-800 mb-2">
//           Your KYC Details
//         </h1>
//         <div className="mt-6 bg-blue-50 inline-flex px-4 py-2 rounded-lg">
//           <span className="text-blue-800 font-medium">
//             Status:{" "}
//             {kycData.status === 0
//               ? "Pending"
//               : kycData.status === 1
//               ? "Approved"
//               : kycData.status === 2
//               ? "Rejected"
//               : "Unknown"}
//           </span>
//         </div>
//       </div>

//       {/* Card */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         {/* Submission Details */}
//         <div className="px-6 py-5">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">
//             Personal Details
//           </h3>

//           {/* Documents */}
//           <div className="mb-6">
//             <div className="flex items-center mb-3">
//               <FaFileAlt className="text-gray-400 mr-2" />
//               <h4 className="font-medium text-gray-800">Identity Documents</h4>
//             </div>
//             <div className="space-y-3 pl-8">
//               <div>
//                 <p className="text-sm font-medium text-gray-700">
//                   Aadhar Card Number
//                 </p>
//                 <p className="text-sm text-gray-600">{kycData.aadhar_no}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-700">
//                   PAN Card Number
//                 </p>
//                 <p className="text-sm text-gray-600">{kycData.pancard_no}</p>
//               </div>
//             </div>
//           </div>

//           {/* Bank Details */}
//           <div className="mb-6">
//             <div className="flex items-center mb-3">
//               <h4 className="font-medium text-gray-800">Bank Details</h4>
//             </div>
//             <div className="grid grid-cols-2 gap-4 pl-8">
//               <div>
//                 <p className="text-sm text-gray-500">Account Name</p>
//                 <p className="text-sm font-medium">{kycData.bank_acc_name}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Account Number</p>
//                 <p className="text-sm font-medium">{kycData.bank_acc_no}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">IFSC Code</p>
//                 <p className="text-sm font-medium">{kycData.ifsc_code}</p>
//               </div>
//             </div>
//           </div>

//           {/* Photo */}
//           <div>
//             <div className="flex items-center mb-3">
//               <FaUserCircle className="text-gray-400 mr-2" />
//               <h4 className="font-medium text-gray-800">Uploaded Documents</h4>
//             </div>
//             <div className="pl-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Aadhar Card</p>
//                 <div className="border border-gray-200 rounded-lg p-1">
//                   <img
//                     src={`/storage/${kycData.upload_aadhar}`}
//                     alt="Aadhar Card"
//                     className="h-32 w-full object-contain rounded-md"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">PAN Card</p>
//                 <div className="border border-gray-200 rounded-lg p-1">
//                   <img
//                     src={`/storage/${kycData.upload_pancard}`}
//                     alt="PAN Card"
//                     className="h-32 w-full object-contain rounded-md"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Photograph</p>
//                 <div className="border border-gray-200 rounded-lg p-1">
//                   <img
//                     src={`/storage/${kycData.upload_photo}`}
//                     alt="Photograph"
//                     className="h-32 w-full object-contain rounded-md"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KycInfo;
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchKyc } from "../../redux/features/profile/kycSlice";
// import { FaCheckCircle, FaFileAlt, FaUserCircle, FaEdit } from "react-icons/fa";
// import { Link } from "react-router-dom";

// const KycInfo = () => {
//   const dispatch = useDispatch();
//   const { data: kycData, loading, error } = useSelector((state) => state.kyc);

//   useEffect(() => {
//     dispatch(fetchKyc());
//   }, [dispatch]);

//   if (loading) {
//     return <p className="text-center text-blue-600">Loading KYC data...</p>;
//   }

//   if (error) {
//     return (
//       <p className="text-center text-red-600">Error fetching KYC: {error}</p>
//     );
//   }

//   if (!kycData) {
//     return (
//       <p className="text-center text-gray-500">No KYC data submitted yet.</p>
//     );
//   }

//   const getStatusStyles = (status) => {
//     switch (status) {
//       case 0: // Pending
//         return { bg: "bg-yellow-50", text: "text-yellow-800" };
//       case 1: // Approved
//         return { bg: "bg-green-50", text: "text-green-800" };
//       case 2: // Rejected
//         return { bg: "bg-red-50", text: "text-red-800" };
//       default:
//         return { bg: "bg-gray-50", text: "text-gray-800" };
//     }
//   };

//   const statusStyles = getStatusStyles(kycData.status);

//   return (
//     <div className="max-w-2xl mx-auto p-4 sm:p-6">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
//           <FaCheckCircle className="text-green-600 text-3xl" />
//         </div>
//         <h1 className="text-2xl font-bold text-gray-800 mb-2">
//           Your KYC Details
//         </h1>
//         <div className="mt-6 flex items-center justify-center gap-4">
//           <div
//             className={`${statusStyles.bg} inline-flex px-4 py-2 rounded-lg`}
//           >
//             <span className={`${statusStyles.text} font-medium`}>
//               Status:{" "}
//               {kycData.status === 0
//                 ? "Pending"
//                 : kycData.status === 1
//                 ? "Approved"
//                 : kycData.status === 2
//                 ? "Rejected"
//                 : "Unknown"}
//             </span>
//           </div>

//           {/* Show EDIT button only when status is Rejected */}
//           {kycData.status === 2 && (
//             <Link
//               to="/kyc/edit" // Update this path as needed
//               className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
//             >
//               <FaEdit />
//               Edit KYC
//             </Link>
//           )}
//         </div>
//       </div>

//       {/* Card */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         {/* Submission Details */}
//         <div className="px-6 py-5">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">
//             Personal Details
//           </h3>

//           {/* Documents */}
//           <div className="mb-6">
//             <div className="flex items-center mb-3">
//               <FaFileAlt className="text-gray-400 mr-2" />
//               <h4 className="font-medium text-gray-800">Identity Documents</h4>
//             </div>
//             <div className="space-y-3 pl-8">
//               <div>
//                 <p className="text-sm font-medium text-gray-700">
//                   Aadhar Card Number
//                 </p>
//                 <p className="text-sm text-gray-600">{kycData.aadhar_no}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-700">
//                   PAN Card Number
//                 </p>
//                 <p className="text-sm text-gray-600">{kycData.pancard_no}</p>
//               </div>
//             </div>
//           </div>

//           {/* Bank Details */}
//           <div className="mb-6">
//             <div className="flex items-center mb-3">
//               <h4 className="font-medium text-gray-800">Bank Details</h4>
//             </div>
//             <div className="grid grid-cols-2 gap-4 pl-8">
//               <div>
//                 <p className="text-sm text-gray-500">Account Name</p>
//                 <p className="text-sm font-medium">{kycData.bank_acc_name}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Account Number</p>
//                 <p className="text-sm font-medium">{kycData.bank_acc_no}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">IFSC Code</p>
//                 <p className="text-sm font-medium">{kycData.ifsc_code}</p>
//               </div>
//             </div>
//           </div>

//           {/* Photo */}
//           <div>
//             <div className="flex items-center mb-3">
//               <FaUserCircle className="text-gray-400 mr-2" />
//               <h4 className="font-medium text-gray-800">Uploaded Documents</h4>
//             </div>
//             <div className="pl-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Aadhar Card</p>
//                 <div className="border border-gray-200 rounded-lg p-1">
//                   <img
//                     src={`/storage/${kycData.upload_aadhar}`}
//                     alt="Aadhar Card"
//                     className="h-32 w-full object-contain rounded-md"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">PAN Card</p>
//                 <div className="border border-gray-200 rounded-lg p-1">
//                   <img
//                     src={`/storage/${kycData.upload_pancard}`}
//                     alt="PAN Card"
//                     className="h-32 w-full object-contain rounded-md"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Photograph</p>
//                 <div className="border border-gray-200 rounded-lg p-1">
//                   <img
//                     src={`/storage/${kycData.upload_photo}`}
//                     alt="Photograph"
//                     className="h-32 w-full object-contain rounded-md"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KycInfo;
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchKyc } from "../../redux/features/profile/kycSlice";
import { FaCheckCircle, FaFileAlt, FaUserCircle, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const KycInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: kycData, loading, error } = useSelector((state) => state.kyc);

  useEffect(() => {
    dispatch(fetchKyc());
  }, [dispatch]);

  const handleEditClick = () => {
    navigate("kyc-edit"); // Update this path to match your route
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error fetching KYC: {error.message || "Unknown error"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!kycData) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 text-center">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r inline-block">
          <p className="text-blue-700">No KYC data submitted yet.</p>
        </div>
        <button
          onClick={() => navigate("dashboard/kyc-edit")}
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaEdit className="mr-2" />
          Submit KYC
        </button>
      </div>
    );
  }

  const getStatusStyles = (status) => {
    switch (status) {
      case 0: // Pending
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-800",
          icon: "text-yellow-500",
        };
      case 1: // Approved
        return {
          bg: "bg-green-50",
          text: "text-green-800",
          icon: "text-green-500",
        };
      case 2: // Rejected
        return {
          bg: "bg-red-50",
          text: "text-red-800",
          icon: "text-red-500",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-800",
          icon: "text-gray-500",
        };
    }
  };

  const statusStyles = getStatusStyles(kycData.status);
  const statusText =
    kycData.status === 0
      ? "Pending"
      : kycData.status === 1
      ? "Approved"
      : kycData.status === 2
      ? "Rejected"
      : "Unknown";

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 ${statusStyles.bg} rounded-full mb-4`}
        >
          <FaCheckCircle className={`${statusStyles.icon} text-3xl`} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Your KYC Details
        </h1>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <div className={`${statusStyles.bg} px-4 py-2 rounded-lg`}>
            <span className={`${statusStyles.text} font-medium`}>
              Status: {statusText}
            </span>
          </div>
          {/* Show EDIT button only when status is Rejected or no KYC data */}

          {(kycData.status === 2 || !kycData) && (
            <Link
              to="/dashboard/kyc-edit"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaEdit />
              {kycData ? "Edit KYC" : "Submit KYC"}
            </Link>
          )}
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Submission Details */}
        <div className="px-6 py-5">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Personal Details
          </h3>

          {/* Documents */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <FaFileAlt className="text-gray-400 mr-2" />
              <h4 className="font-medium text-gray-800">Identity Documents</h4>
            </div>
            <div className="space-y-3 pl-8">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Aadhar Card Number
                </p>
                <p className="text-sm text-gray-600">{kycData.aadhar_no}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  PAN Card Number
                </p>
                <p className="text-sm text-gray-600">{kycData.pancard_no}</p>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <h4 className="font-medium text-gray-800">Bank Details</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 pl-8">
              <div>
                <p className="text-sm text-gray-500">Account Name</p>
                <p className="text-sm font-medium">{kycData.bank_acc_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Number</p>
                <p className="text-sm font-medium">{kycData.bank_acc_no}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">IFSC Code</p>
                <p className="text-sm font-medium">{kycData.ifsc_code}</p>
              </div>
            </div>
          </div>

          {/* Photo */}
          <div>
            <div className="flex items-center mb-3">
              <FaUserCircle className="text-gray-400 mr-2" />
              <h4 className="font-medium text-gray-800">Uploaded Documents</h4>
            </div>
            <div className="pl-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Aadhar Card</p>
                <div className="border border-gray-200 rounded-lg p-1">
                  <img
                    src={`/storage/${kycData.upload_aadhar}`}
                    alt="Aadhar Card"
                    className="h-32 w-full object-contain rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/document-placeholder.png";
                    }}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">PAN Card</p>
                <div className="border border-gray-200 rounded-lg p-1">
                  <img
                    src={`/storage/${kycData.upload_pancard}`}
                    alt="PAN Card"
                    className="h-32 w-full object-contain rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/document-placeholder.png";
                    }}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Photograph</p>
                <div className="border border-gray-200 rounded-lg p-1">
                  <img
                    src={`/storage/${kycData.upload_photo}`}
                    alt="Photograph"
                    className="h-32 w-full object-contain rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/avatar-placeholder.png";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycInfo;
