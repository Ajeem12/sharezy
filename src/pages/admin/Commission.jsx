import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  secureAdminCommission,
  commissionUpdate,
  clearCommissionState,
} from "../../redux/features/admin/commissionSlice";
import DataTable from "react-data-table-component";

const CommissionComponent = () => {
  const dispatch = useDispatch();
  const { report, updateResponse, status, error } = useSelector(
    (state) => state.commission
  );

  const [reportPayload, setReportPayload] = useState({ from: "", to: "" });
  const [updatePayload, setUpdatePayload] = useState({ commission: "" });

  // Fetch secure report
  useEffect(() => {
    if (reportPayload.from && reportPayload.to) {
      dispatch(secureAdminCommission(reportPayload));
    }
  }, [dispatch, reportPayload]);

  const handleReportChange = (e) => {
    setReportPayload((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateChange = (e) => {
    setUpdatePayload((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateSubmit = () => {
    const payload = {
      commission: parseFloat(updatePayload.commission),
    };
    if (isNaN(payload.commission)) {
      alert("Please enter a valid commission value");
      return;
    }
    dispatch(commissionUpdate(payload));
  };

  const columns = [
    {
      name: "Booking ID",
      selector: (row) => row.booking_id,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
      right: true,
      format: (row) => `₹${row.amount.toFixed(2)}`,
    },
    {
      name: "Commission (%)",
      selector: (row) => row.commission_per,
      sortable: true,
      right: true,
    },
    {
      name: "Commission Amt",
      selector: (row) => row.commission_amt,
      sortable: true,
      right: true,
      format: (row) => `₹${row.commission_amt.toFixed(2)}`,
    },
    {
      name: "User Name",
      selector: (row) => row.user_details?.name || "-",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.user_details?.email || "-",
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.user_details?.mobile || "-",
      sortable: true,
    },
    // {
    //   name: 'Location',
    //   selector: (row) => row.user_details?.location || '-',
    //   sortable: true,
    // },
  ];

  return (
    <div className="max-w-7xl mx-auto p-1.5">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Report Section */}
        <section className=" w-full">
          <h1 className="text-3xl font-semibold mb-6 text-center md:text-left text-blue-700">
            Commission Report
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <label className="flex flex-col text-gray-700 font-medium">
              From:
              <input
                type="date"
                name="from"
                value={reportPayload.from}
                onChange={handleReportChange}
                className="mt-1 border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>

            <label className="flex flex-col text-gray-700 font-medium">
              To:
              <input
                type="date"
                name="to"
                value={reportPayload.to}
                onChange={handleReportChange}
                className="mt-1 border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>
          </div>

          {status === "loading" ? (
            <p className="text-center py-10 text-lg font-semibold text-blue-600 animate-pulse">
              Loading report...
            </p>
          ) : status === "failed" ? (
            <p className="text-red-600 text-center py-10">Error: {error}</p>
          ) : report && Array.isArray(report) && report.length > 0 ? (
            <DataTable
              title="Commission Report"
              columns={columns}
              data={report}
              pagination
              highlightOnHover
              striped
              responsive
            />
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No report data available.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default CommissionComponent;
