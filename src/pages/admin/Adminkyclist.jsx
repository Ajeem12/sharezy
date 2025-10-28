// import React, { useEffect, useState } from "react";
// import { FaEye } from "react-icons/fa";
// import { updateKycStatusLocally } from "../../redux/features/admin/adminKycListSlice";

// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAdmins } from "../../redux/features/admin/adminKycListSlice";
// import { approveKyc, denyKyc } from "../../redux/features/admin/kycStatusSlice";

// const AdminKycList = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { admins, loading, error } = useSelector(
//     (state) => state.adminKycListSlice
//   );

//   const [showModal, setShowModal] = useState(false);
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [selectedKycId, setSelectedKycId] = useState(null);
//   const [selectedKycData, setSelectedKycData] = useState(null);
//   const [showViewModal, setShowViewModal] = useState(false);

//   useEffect(() => {
//     dispatch(fetchAdmins());
//   }, [dispatch]);

//   const handleApprove = (id) => {
//     dispatch(approveKyc(id)).then((res) => {
//       if (res.meta.requestStatus === "fulfilled") {
//         dispatch(updateKycStatusLocally({ id, status: 1 }));
//       }
//     });
//   };

//   const handleReject = (id) => {
//     setSelectedKycId(id);
//     setRejectionReason("");
//     setShowModal(true);
//   };

//   const handleView = (id) => {
//     navigate(`/admin/kycdetail/${id}`);
//   };

//   const submitRejection = () => {
//     if (rejectionReason.trim()) {
//       dispatch(denyKyc({ id: selectedKycId, reason: rejectionReason })).then(
//         (res) => {
//           if (res.meta.requestStatus === "fulfilled") {
//             dispatch(updateKycStatusLocally({ id: selectedKycId, status: 2 }));
//             setShowModal(false);
//           }
//         }
//       );
//     }
//   };

//   const getStatusText = (statusCode) => {
//     switch (statusCode) {
//       case 0:
//         return "Pending";
//       case 1:
//         return "Approved";
//       case 2:
//         return "Rejected";
//       default:
//         return "Unknown";
//     }
//   };

//   const getStatusClasses = (statusCode) => {
//     switch (statusCode) {
//       case 0:
//         return "bg-yellow-100 text-yellow-800";
//       case 1:
//         return "bg-green-100 text-green-800";
//       case 2:
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   if (loading)
//     return <div className="text-center py-8">Loading KYC submissions...</div>;
//   if (error)
//     return (
//       <div className="text-center py-8 text-red-500">
//         Error: {error.message || error}
//       </div>
//     );

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header */}
//       <div className="sm:flex sm:items-center mb-8">
//         <div className="sm:flex-auto">
//           <h1 className="text-2xl font-bold text-gray-900">KYC Submissions</h1>
//           <p className="mt-2 text-sm text-gray-600">
//             Review and manage user KYC verification requests
//           </p>
//         </div>
//         {/* <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
//           <button
//             type="button"
//             className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//           >
//             Export Data
//           </button>
//         </div> */}
//       </div>

//       {/* Table */}
//       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
//                   User ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
//                   Documents
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
//                   Bank Details
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {admins?.data?.map((kyc) => (
//                 <tr key={kyc.id} className="hover:bg-gray-50">
//                   {/* User ID Column */}
//                   <td className="px-6 py-4 whitespace-nowrap w-1/6">
//                     <div className="flex items-center">
//                       <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
//                         {kyc.upload_photo && (
//                           <img
//                             className="h-full w-full object-cover"
//                             src={`${
//                               import.meta.env.VITE_API_URL
//                             }/uploads/upload_photo/${kyc.upload_photo}`}
//                             alt="User"
//                           />
//                         )}
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           User #{kyc.login_user_id}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           KYC ID: {kyc.id}
//                         </div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Documents Column */}
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-1/6">
//                     <div className="flex flex-col space-y-2">
//                       <div className="flex items-center">
//                         <span className="mr-2">Aadhar:</span>
//                         <span className="truncate">{kyc.aadhar_no}</span>
//                         {kyc.upload_aadhar && (
//                           <a
//                             href={`${
//                               import.meta.env.VITE_IMAGE_BASE_URL
//                             }/uploads/aadhar/${kyc.upload_aadhar}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="ml-2 text-blue-600 hover:text-blue-800"
//                           >
//                             View
//                           </a>
//                         )}
//                       </div>
//                       <div className="flex items-center">
//                         <span className="mr-2">PAN:</span>
//                         <span className="truncate">{kyc.pancard_no}</span>
//                         {kyc.upload_pancard && (
//                           <a
//                             href={`${
//                               import.meta.env.VITE_IMAGE_BASE_URL
//                             }/uploads/pancard/${kyc.upload_pancard}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="ml-2 text-blue-600 hover:text-blue-800"
//                           >
//                             View
//                           </a>
//                         )}
//                       </div>
//                     </div>
//                   </td>

//                   {/* Bank Details Column */}
//                   <td className="px-6 py-4 w-1/6">
//                     <div className="text-sm text-gray-900">
//                       <div className="truncate">{kyc.bank_acc_name}</div>
//                       <div className="text-gray-500 text-xs mt-1">
//                         Acc: {kyc.bank_acc_no}
//                       </div>
//                       <div className="text-gray-500 text-xs">
//                         IFSC: {kyc.ifsc_code}
//                       </div>
//                     </div>
//                   </td>

//                   {/* Status Column */}
//                   <td className="px-6 py-4 whitespace-nowrap w-1/6">
//                     {kyc.status != 0 ? (
//                       <div className=" mr-6 flex space-x-0">
//                         <button
//                           className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
//                           onClick={() => handleApprove(kyc.id)}
//                         >
//                           Approve
//                         </button>
//                         <button
//                           className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
//                           onClick={() => handleReject(kyc.id)}
//                         >
//                           Reject
//                         </button>
//                       </div>
//                     ) : (
//                       <span
//                         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
//                           kyc.status
//                         )}`}
//                       >
//                         {getStatusText(kyc.status)}
//                       </span>
//                     )}
//                   </td>

//                   {/* Date Column */}
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-1/6">
//                     {new Date(kyc.created_at).toLocaleDateString()}
//                   </td>

//                   {/* Actions Column */}
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-1/6">
//                     <button
//                       className="ml-25 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs flex items-center justify-center"
//                       onClick={() => handleView(kyc.id)}
//                     >
//                       <FaEye className="h-3 w-3 mr-1" />
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Reject Reason Modal */}
//         {showModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
//               <h2 className="text-lg font-semibold mb-4">Reject KYC</h2>
//               <p className="text-sm mb-2 text-gray-700">
//                 Please enter a reason for rejection:
//               </p>
//               <textarea
//                 rows="3"
//                 value={rejectionReason}
//                 onChange={(e) => setRejectionReason(e.target.value)}
//                 className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200 text-sm"
//                 placeholder="Enter reason..."
//               ></textarea>
//               <div className="mt-4 flex justify-end space-x-2">
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={submitRejection}
//                   className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
//                 >
//                   Reject
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* View Modal */}
//         {showViewModal && selectedKycData && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
//               <h2 className="text-xl font-semibold mb-4">KYC Details</h2>
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <strong>User ID:</strong> {selectedKycData.login_user_id}
//                 </div>
//                 <div>
//                   <strong>KYC ID:</strong> {selectedKycData.id}
//                 </div>
//                 <div>
//                   <strong>Aadhar No:</strong> {selectedKycData.aadhar_no}
//                 </div>
//                 <div>
//                   <strong>PAN No:</strong> {selectedKycData.pancard_no}
//                 </div>
//                 <div>
//                   <strong>Bank Name:</strong> {selectedKycData.bank_acc_name}
//                 </div>
//                 <div>
//                   <strong>Account No:</strong> {selectedKycData.bank_acc_no}
//                 </div>
//                 <div>
//                   <strong>IFSC Code:</strong> {selectedKycData.ifsc_code}
//                 </div>
//                 <div>
//                   <strong>Status:</strong>{" "}
//                   {getStatusText(selectedKycData.status)}
//                 </div>
//               </div>
//               <div className="mt-4">
//                 {selectedKycData.upload_aadhar && (
//                   <p className="mt-2">
//                     <span className="font-medium">Aadhar File:</span>{" "}
//                     <a
//                       href={`${import.meta.env.VITE_API_URL}/uploads/${
//                         selectedKycData.upload_aadhar
//                       }`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 underline"
//                     >
//                       View Aadhar
//                     </a>
//                   </p>
//                 )}
//                 {selectedKycData.upload_pancard && (
//                   <p className="mt-2">
//                     <span className="font-medium">PAN File:</span>{" "}
//                     <a
//                       href={`${import.meta.env.VITE_API_URL}/uploads/${
//                         selectedKycData.upload_pancard
//                       }`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 underline"
//                     >
//                       View PAN
//                     </a>
//                   </p>
//                 )}
//               </div>
//               <div className="mt-6 flex justify-end">
//                 <button
//                   onClick={() => setShowViewModal(false)}
//                   className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminKycList;
import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { updateKycStatusLocally } from "../../redux/features/admin/adminKycListSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdmins } from "../../redux/features/admin/adminKycListSlice";
import { approveKyc, denyKyc } from "../../redux/features/admin/kycStatusSlice";
import { fetchProfile } from "../../redux/features/profile/profileSlice";

const AdminKycList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admins, loading, error } = useSelector(
    (state) => state.adminKycListSlice
  );
  const { data: formData } = useSelector((state) => state.profile);

  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedKycId, setSelectedKycId] = useState(null);
  const [selectedKycData, setSelectedKycData] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAdmins());
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleApprove = (id) => {
    dispatch(approveKyc(id)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(updateKycStatusLocally({ id, status: 1 }));
      }
    });
  };

  const handleReject = (id) => {
    setSelectedKycId(id);
    setRejectionReason("");
    setShowModal(true);
  };

  const handleView = (id) => {
    navigate(`/admin/kycdetail/${id}`);
  };

  const submitRejection = () => {
    if (rejectionReason.trim()) {
      dispatch(denyKyc({ id: selectedKycId, reason: rejectionReason })).then(
        (res) => {
          if (res.meta.requestStatus === "fulfilled") {
            dispatch(updateKycStatusLocally({ id: selectedKycId, status: 2 }));
            setShowModal(false);
          }
        }
      );
    }
  };

  const getStatusText = (statusCode) => {
    switch (statusCode) {
      case 0:
        return "Pending";
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const getStatusClasses = (statusCode) => {
    switch (statusCode) {
      case 0:
        return "bg-yellow-100 text-yellow-800";
      case 1:
        return "bg-green-100 text-green-800";
      case 2:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading KYC submissions...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message || error}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">KYC Submissions</h1>
          <p className="mt-2 text-sm text-gray-600">
            Review and manage user KYC verification requests
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  User Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Bank Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins?.data?.map((kyc) => (
                <tr key={kyc.id} className="hover:bg-gray-50">
                  {/* User Details Column */}
                  <td className="px-6 py-4 whitespace-nowrap w-1/6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                        {kyc.user_details?.profile_image && (
                          <img
                            className="h-full w-full object-cover"
                            src={`${
                              import.meta.env.VITE_IMAGE_BASE_URL
                            }/uploads/users/${kyc.user_details.profile_image}`}
                            alt="User"
                          />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {kyc.user_details?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {kyc.user_details?.mobile || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Documents Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-1/6">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <span className="mr-2">Aadhar:</span>
                        <span className="truncate">{kyc.aadhar_no}</span>
                        {kyc.upload_aadhar && (
                          <a
                            href={`${
                              import.meta.env.VITE_IMAGE_BASE_URL
                            }/uploads/aadhar/${kyc.upload_aadhar}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            View
                          </a>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">PAN:</span>
                        <span className="truncate">{kyc.pancard_no}</span>
                        {kyc.upload_pancard && (
                          <a
                            href={`${
                              import.meta.env.VITE_IMAGE_BASE_URL
                            }/uploads/pancard/${kyc.upload_pancard}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            View
                          </a>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Bank Details Column */}
                  <td className="px-6 py-4 w-1/6">
                    <div className="text-sm text-gray-900">
                      <div className="truncate">{kyc.bank_acc_name}</div>
                      <div className="text-gray-500 text-xs mt-1">
                        Acc: {kyc.bank_acc_no}
                      </div>
                      <div className="text-gray-500 text-xs">
                        IFSC: {kyc.ifsc_code}
                      </div>
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="px-6 py-4 whitespace-nowrap w-1/6">
                    {kyc.status === 0 ? (
                      <div className="mr-6 flex space-x-2">
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                          onClick={() => handleApprove(kyc.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                          onClick={() => handleReject(kyc.id)}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                          kyc.status
                        )}`}
                      >
                        {getStatusText(kyc.status)}
                      </span>
                    )}
                  </td>

                  {/* Date Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-1/6">
                    {new Date(kyc.created_at).toLocaleDateString()}
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-1/6">
                    <button
                      className="ml-25 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs flex items-center justify-center"
                      onClick={() => handleView(kyc.id)}
                    >
                      <FaEye className="h-3 w-3 mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reject Reason Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Reject KYC</h2>
              <p className="text-sm mb-2 text-gray-700">
                Please enter a reason for rejection:
              </p>
              <textarea
                rows="3"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200 text-sm"
                placeholder="Enter reason..."
              ></textarea>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRejection}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && selectedKycData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
              <h2 className="text-xl font-semibold mb-4">KYC Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Name:</strong> {selectedKycData.user_details?.name}
                </div>
                <div>
                  <strong>Mobile:</strong>{" "}
                  {selectedKycData.user_details?.mobile}
                </div>
                <div>
                  <strong>Aadhar No:</strong> {selectedKycData.aadhar_no}
                </div>
                <div>
                  <strong>PAN No:</strong> {selectedKycData.pancard_no}
                </div>
                <div>
                  <strong>Bank Name:</strong> {selectedKycData.bank_acc_name}
                </div>
                <div>
                  <strong>Account No:</strong> {selectedKycData.bank_acc_no}
                </div>
                <div>
                  <strong>IFSC Code:</strong> {selectedKycData.ifsc_code}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  {getStatusText(selectedKycData.status)}
                </div>
              </div>
              <div className="mt-4">
                {selectedKycData.upload_aadhar && (
                  <p className="mt-2">
                    <span className="font-medium">Aadhar File:</span>{" "}
                    <a
                      href={`${import.meta.env.VITE_API_URL}/uploads/aadhar/${
                        selectedKycData.upload_aadhar
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Aadhar
                    </a>
                  </p>
                )}
                {selectedKycData.upload_pancard && (
                  <p className="mt-2">
                    <span className="font-medium">PAN File:</span>{" "}
                    <a
                      href={`${import.meta.env.VITE_API_URL}/uploads/pancard/${
                        selectedKycData.upload_pancard
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View PAN
                    </a>
                  </p>
                )}
                {selectedKycData.upload_photo && (
                  <p className="mt-2">
                    <span className="font-medium">User Photo:</span>{" "}
                    <a
                      href={`${
                        import.meta.env.VITE_API_URL
                      }/upload_photo/upload_photo/${
                        selectedKycData.upload_photo
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Photo
                    </a>
                  </p>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminKycList;
