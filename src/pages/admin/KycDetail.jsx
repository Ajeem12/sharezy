import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  MdPerson,
  MdAssignment,
  MdVerifiedUser,
  MdEdit,
  MdChevronLeft,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getKycById,
  updateKycStatusLocally,
} from "../../redux/features/admin/adminKycListSlice";
import { approveKyc, denyKyc } from "../../redux/features/admin/kycStatusSlice";

export default function KycDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedKycId, setSelectedKycId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [localKyc, setLocalKyc] = useState(null);

  const { currentKyc, loading, error } = useSelector(
    (state) => state.adminKycListSlice
  );

  useEffect(() => {
    if (id) {
      dispatch(getKycById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentKyc?.data) {
      setLocalKyc(currentKyc.data);
    }
  }, [currentKyc]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!localKyc)
    return <div className="text-center p-4">No KYC data found.</div>;

  const handleApprove = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to approve this KYC application!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      try {
        // Optimistically update local state first
        setLocalKyc((prev) => ({ ...prev, status: 1 }));

        const res = await dispatch(approveKyc(id)).unwrap();
        dispatch(updateKycStatusLocally({ id, status: 1 }));

        Swal.fire(
          "Approved!",
          "The KYC has been approved successfully.",
          "success"
        );
      } catch (error) {
        // Revert if API call fails
        setLocalKyc((prev) => ({ ...prev, status: 0 }));
        Swal.fire("Error!", error.message || "Failed to approve KYC", "error");
      }
    }
  };

  const handleReject = (id) => {
    setSelectedKycId(id);
    setRejectionReason("");
    setShowModal(true);
  };

  const submitRejection = async () => {
    if (!rejectionReason.trim()) return;

    try {
      // Optimistically update local state first
      setLocalKyc((prev) => ({ ...prev, status: 2 }));

      const res = await dispatch(
        denyKyc({ id: selectedKycId, reason: rejectionReason })
      ).unwrap();
      dispatch(updateKycStatusLocally({ id: selectedKycId, status: 2 }));

      setShowModal(false);
      Swal.fire("Rejected!", "The KYC has been rejected.", "success");
    } catch (error) {
      // Revert if API call fails
      setLocalKyc((prev) => ({ ...prev, status: 0 }));
      Swal.fire("Error!", error.message || "Failed to reject KYC", "error");
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

  return (
    <div className="container mx-auto p-4">
      {/* Rejection Reason Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Reason for Rejection</h3>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              rows="4"
              placeholder="Enter reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                disabled={!rejectionReason.trim()}
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 mb-4"
      >
        <MdChevronLeft size={20} /> Back to KYC List
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            KYC Verification{" "}
            <span className="text-gray-500">#{localKyc.id}</span>
          </h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(
              localKyc.status
            )}`}
          >
            {getStatusText(localKyc.status)}
          </span>
        </div>

        <Section title="KYC Information" icon={<MdPerson />}>
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              <TableRow label="User ID" value={localKyc.login_user_id} />
              <TableRow label="Aadhar No" value={localKyc.aadhar_no} />
              <TableRow label="PAN No" value={localKyc.pancard_no} />
              <TableRow
                label="Bank Account Name"
                value={localKyc.bank_acc_name}
              />
              <TableRow label="Account No" value={localKyc.bank_acc_no} />
              <TableRow label="IFSC Code" value={localKyc.ifsc_code} />
              <TableRow
                label="Created At"
                value={new Date(localKyc.created_at).toLocaleString()}
              />
              <TableRow
                label="Updated At"
                value={new Date(localKyc.updated_at).toLocaleString()}
              />
            </tbody>
          </table>
        </Section>

        <Section title="Uploaded Documents" icon={<MdAssignment />}>
          <div className="grid md:grid-cols-3 gap-6">
            {localKyc.upload_aadhar && (
              <DocumentCard
                title="Aadhar Card"
                url={`${import.meta.env.VITE_IMAGE_BASE_URL}/uploads/aadhar/${
                  localKyc.upload_aadhar
                }`}
              />
            )}
            {localKyc.upload_pancard && (
              <DocumentCard
                title="PAN Card"
                url={`${import.meta.env.VITE_IMAGE_BASE_URL}/uploads/pancard/${
                  localKyc.upload_pancard
                }`}
              />
            )}
            {localKyc.upload_photo && (
              <DocumentCard
                title="User Photo"
                url={`${
                  import.meta.env.VITE_IMAGE_BASE_URL
                }/uploads/upload_photo/${localKyc.upload_photo}`}
              />
            )}
          </div>
        </Section>

        {/* Action Buttons */}
        <div className="mt-8">
          {localKyc.status != 0 ? (
            <div className="flex justify-end">
              <button
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl shadow-md hover:bg-emerald-700 transition duration-200 text-sm"
                onClick={() => handleApprove(localKyc.id)}
              >
                <MdCheckCircle /> Approve
              </button>
              <button
                className="ml-4 flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-2xl shadow-md hover:bg-rose-700 transition duration-200 text-sm"
                onClick={() => handleReject(localKyc.id)}
              >
                <MdCancel /> Reject
              </button>
            </div>
          ) : (
            <span
              className={`px-3 py-2 inline-flex text-sm font-semibold rounded-full ${getStatusClasses(
                localKyc.status
              )}`}
            >
              {getStatusText(localKyc.status)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable Table Row
function TableRow({ label, value }) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
        {label}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {value || "N/A"}
      </td>
    </tr>
  );
}

// Section wrapper
function Section({ title, icon, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        {icon} <span className="ml-2">{title}</span>
      </h2>
      {children}
    </div>
  );
}

// Document Card
function DocumentCard({ title, url }) {
  return (
    <div className="text-center">
      <p className="text-sm font-medium mb-2">{title}</p>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img
          src={url}
          alt={title}
          className="w-full h-48 object-contain rounded-md border"
        />
      </a>
    </div>
  );
}
