import React from 'react';
import { FaWallet, FaPlus, FaArrowDown } from 'react-icons/fa';

const Wallet = () => {
  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      {/* Wallet Header */}
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6  px-4 py-2 rounded-md  w-fit">
        {/* <FaWallet className="text-blue-500" /> */}
         Wallet
      </h1>

      {/* Balance & Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div>
          <p className="text-sm text-gray-500">Available Balance</p>
          <h3 className="text-3xl font-bold text-blue-600">₹0000</h3>
        </div>
        <div className="flex gap-4">
         
        
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Transaction History</h4>
        <ul className="divide-y divide-gray-200 text-sm">
          <li className="flex justify-between py-3">
            <span> Booking Date</span>
            <span className="text-red-500 font-medium">02-02-25</span>
          </li>
          <li className="flex justify-between py-3">
            <span>Amount</span>
            <span className="text-green-600 font-medium">3999</span>
          </li>
         
        </ul>
      </div>
    </div>
  );
};

export default Wallet;
