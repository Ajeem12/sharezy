import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWalletList } from "../../redux/features/profile/walletSlice";

const Wallet = () => {
  const dispatch = useDispatch();
  const { walletHistory, loading, error } = useSelector(
    (state) => state.wallet
  );

  useEffect(() => {
    dispatch(fetchWalletList());
  }, [dispatch]);

  const totalBalance = walletHistory.reduce(
    (sum, x) => sum + Number(x?.payment_amount || 0),
    0
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 md:p-6">
      {/* Wallet Header */}
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 px-3 py-1 w-fit">
        Wallet
      </h1>

      {/* Balance Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <p className="text-sm text-gray-500">Available Balance</p>
        <h3 className="text-2xl md:text-3xl font-bold text-blue-600">
          ₹{totalBalance}
        </h3>
      </div>

      {/* Wallet History */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Transaction History
        </h4>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 text-left font-semibold text-gray-600">#</th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Booking ID
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Amount
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Type
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Reason
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {walletHistory?.map((item, index) => {
                const isDeduct = item.status === 1;

                return (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">{item.booking_id}</td>

                    <td className="p-4 font-semibold">
                      {isDeduct ? (
                        <span className="text-red-600">
                          - ₹{item.payment_amount}
                        </span>
                      ) : (
                        <span className="text-green-600">
                          + ₹{item.payment_amount}
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      {isDeduct ? (
                        <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600">
                          Deducted
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
                          Added
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-red-500">
                      {item.cancel_reason || "-"}
                    </td>

                    <td className="p-4">{item.payment_date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {walletHistory?.map((item, index) => {
            const isDeduct = item.status === 1;

            return (
              <div
                key={item.id}
                className="border p-4 rounded-lg shadow-sm bg-gray-50"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 text-xs">#{index + 1}</span>

                  {isDeduct ? (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600">
                      Deducted
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-600">
                      Added
                    </span>
                  )}
                </div>

                {/* Amount */}
                <p className="text-lg font-bold mb-1">
                  {isDeduct ? (
                    <span className="text-red-600">
                      - ₹{item.payment_amount}
                    </span>
                  ) : (
                    <span className="text-green-600">
                      + ₹{item.payment_amount}
                    </span>
                  )}
                </p>

                <p className="text-gray-700 text-sm mb-1">
                  Booking ID:{" "}
                  <span className="font-medium">{item.booking_id}</span>
                </p>

                <p className="text-gray-700 text-sm mb-1">
                  Reason:{" "}
                  <span className="text-red-500">
                    {item.cancel_reason || "-"}
                  </span>
                </p>

                <p className="text-gray-500 text-xs">{item.payment_date}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
