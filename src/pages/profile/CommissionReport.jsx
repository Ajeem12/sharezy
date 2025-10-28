import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { commissionReport, clearCommissionState } from '../../redux/features/admin/commissionSlice';

const CommissionReportComponent = () => {
  const dispatch = useDispatch();
  const { report, status, error } = useSelector((state) => state.commission);

  const [reportPayload, setReportPayload] = useState({ from: '', to: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted && reportPayload.from && reportPayload.to) {
      dispatch(commissionReport(reportPayload));
    }
  }, [dispatch, reportPayload, submitted]);

  const handleReportChange = (e) => {
    setReportPayload((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setReportPayload({ from: '', to: '' });
    setSubmitted(false);
    dispatch(clearCommissionState());
  };

  // Define columns for DataTable
  const columns = [
    {
      name: 'Booking ID',
      selector: row => row.booking_id,
      sortable: true,
      width: '120px'
    },
    {
      name: 'Amount',
      selector: row => row.amount,
      sortable: true,
      right: true,
      format: row => `₹${row.amount.toFixed(2)}`,
      cell: row => <span className="font-medium">{`₹${row.amount.toFixed(2)}`}</span>
    },
    {
      name: 'Commission',
      selector: row => row.commission_amt,
      sortable: true,
      right: true,
      format: row => `₹${row.commission_amt.toFixed(2)}`,
      cell: row => <span className="text-blue-600 font-semibold">{`₹${row.commission_amt.toFixed(2)}`}</span>
    },
    {
      name: 'Commission %',
      selector: row => row.commission_per,
      sortable: true,
      right: true,
      format: row => `${row.commission_per}%`,
      cell: row => <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm">{`${row.commission_per}%`}</span>
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#f8fafc',
        fontWeight: '600',
        fontSize: '0.875rem',
        color: '#334155',
      },
    },
    rows: {
      style: {
        '&:not(:last-of-type)': {
          borderBottom: '1px solid #e2e8f0',
        },
      },
    },
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Generating commission report...</p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-red-50 rounded-xl">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Error generating report</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error || 'An unknown error occurred'}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={handleReset}
                className="text-sm font-medium text-red-700 hover:text-red-600 focus:outline-none"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2  ">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Commission Report</h1>
              <p className="mt-1 text-blue-100">View and analyze commission data</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-100 bg-blue-500/20 hover:bg-blue-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-5 border-b border-gray-200">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                id="from"
                name="from"
                value={reportPayload.from}
                onChange={handleReportChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                required
              />
            </div>
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                id="to"
                name="to"
                value={reportPayload.to}
                onChange={handleReportChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                disabled={!reportPayload.from || !reportPayload.to}
              >
                Generate Report
                <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Results</h2>
            {report && report.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {report.length} records found
              </span>
            )}
          </div>

          {!report || report.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No report data</h3>
              <p className="mt-1 text-sm text-gray-500">
                {submitted ? "No records found for the selected date range." : "Select date range to generate report."}
              </p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <DataTable
                columns={columns}
                data={report}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50]}
                highlightOnHover
                responsive
                striped
                noHeader
                defaultSortFieldId={1}
                customStyles={customStyles}
                className="text-sm"
              />
            </div>
          )}
        </div>

        {/* Summary (optional) */}
        {report && report.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="px-3 py-2 bg-blue-50 rounded-lg">
                  <p className="text-xs font-medium text-blue-600">Total Records</p>
                  <p className="text-lg font-semibold text-blue-800">{report.length}</p>
                </div>
                <div className="px-3 py-2 bg-green-50 rounded-lg">
                  <p className="text-xs font-medium text-green-600">Total Commission</p>
                  <p className="text-lg font-semibold text-green-800">
                    ₹{report.reduce((sum, item) => sum + item.commission_amt, 0).toFixed(2)}
                  </p>
                </div>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionReportComponent;