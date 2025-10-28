import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRideDisputes } from "../../redux/features/admin/supportSlice";
import SharezyLoader from "../../components/SharezyLoader";
import DataTable from "react-data-table-component";

const ReportDetailsPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();

  const { rideDisputes, status, error } = useSelector((state) => state.support);

  useEffect(() => {
    if (userId) {
      dispatch(fetchRideDisputes(userId));
    }
  }, [dispatch, userId]);

  // Define columns for the DataTable
  const columns = [
    {
      name: "#",
      cell: (row, index) => index + 1,
      width: "60px",
    },
    {
      name: "Report Title",
      selector: (row) => row.title || `Report #${row.id}`,
      sortable: true,
      wrap: true,
    },
    {
      name: "Remark",
      selector: (row) => row.remark,
      sortable: false,
      wrap: true,
    },
    {
      name: "Report Date",
      selector: (row) => (row.created_at ? new Date(row.created_at).toLocaleString() : "N/A"),
      sortable: true,
    },
    {
      name: "Ride Source",
      selector: (row) => row.my_ride_details?.source || "N/A",
      sortable: true,
    },
    {
      name: "Ride Destination",
      selector: (row) => row.my_ride_details?.destination || "N/A",
      sortable: true,
    },
    {
      name: "Ride Date",
      selector: (row) => row.my_ride_details?.riding_date || "N/A",
      sortable: true,
    },
    {
      name: "Vehicle",
      selector: (row) => row.my_ride_details?.vehicle_name || "N/A",
      sortable: true,
    },
  ];

  if (status === "loading") return <SharezyLoader />;
 if (status === "failed") {
  return (
    <div className="max-w-md mx-auto mt-6 p-4 border border-red-300 bg-red-50 text-red-800 rounded-lg shadow-sm">
      <h2 className="text-base font-semibold flex items-center gap-2">
        <span>🚫 Error loading data</span>
      </h2>
      <p className="mt-1 text-sm">{error || "Something went wrong. Please try again."}</p>
    </div>
  );
}


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">User Report Details</h1>
      {status === "succeeded" && rideDisputes.length === 0 && (
        <p className="text-gray-500">No reports found for this user.</p>
      )}
      {status === "succeeded" && rideDisputes.length > 0 && (
        <DataTable
          columns={columns}
          data={rideDisputes}
          pagination
          highlightOnHover
          striped
          responsive
          defaultSortFieldId={1}
        />
      )}
    </div>
  );
};

export default ReportDetailsPage;
