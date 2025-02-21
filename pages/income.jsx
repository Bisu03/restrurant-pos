import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { FaMoneyBillAlt, FaCreditCard, FaMobileAlt, FaUtensils, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import LoadingSpinner from "../components/LoadingScreen";

const Income = () => {
  const [loading, setLoading] = useState(false);
  const [customerRecords, setCustomerRecords] = useState([]);
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().substring(0, 10),
    to: new Date().toISOString().substring(0, 10),
  });

  const handleDateChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const fetchIncomeData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/customer/incomedetails?fromdate=${dateRange.from}&todate=${dateRange.to}`
      );
      setCustomerRecords(data || []);
    } catch (error) {
      console.error("Error fetching income data:", error);
      setCustomerRecords([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIncomeData();
  }, [dateRange]);

  // Currency formatter
  const formatCurrency = (amount) =>
    Number(amount) > 0
      ? Number(amount).toLocaleString("en-IN", { style: "currency", currency: "INR" })
      : "₹0.00";

  // Calculate totals
  const totals = customerRecords.reduce(
    (acc, record) => {
      const amount = Number(record?.amount?.paybalamount) || 0; // Ensure a number
      acc.total += amount;
      acc[record?.payment_mode] = (acc[record?.payment_mode] || 0) + amount;
      return acc;
    },
    { total: 0, Cash: 0, Card: 0, Online: 0 }
  );

  // Count payment methods
  const paymentCounts = customerRecords.reduce((acc, { payment_mode }) => {
    if (payment_mode) {
      acc[payment_mode] = (acc[payment_mode] || 0) + 1;
    }
    return acc;
  }, {});

  const PaymentTable = ({ mode }) => (
    <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-orange-600">
        {mode} Payments ({paymentCounts[mode] || 0})
      </h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-orange-100">
            <tr>
              <th>Bill No.</th>
              <th>Customer</th>
              <th>Table</th>
              <th>Date</th>
              <th>Delivery Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {customerRecords
              ?.filter((record) => record.payment_mode === mode)
              .map((record, idx) => (
                <tr key={idx} className="hover:bg-orange-50">
                  <td>{record.bill_no}</td>
                  <td>{record.customer_name}</td>
                  <td>{record.customer_table || "Takeaway"}</td>
                  <td>{new Date(record.billing_date).toLocaleDateString()}</td>
                  <td>{record.delivery_type}</td>
                  <td className="font-semibold">
                    {formatCurrency(record?.amount?.paybalamount)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 mt-10">
        {/* Date Selectors */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-lg shadow-md">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="inline mr-2" />
              From Date
            </label>
            <input
              type="date"
              name="from"
              value={dateRange.from}
              onChange={handleDateChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="inline mr-2" />
              To Date
            </label>
            <input
              type="date"
              name="to"
              value={dateRange.to}
              onChange={handleDateChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {loading && <LoadingSpinner />}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
            <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
            <p className="text-2xl font-bold mt-2">{customerRecords.length}</p>
            <FaUtensils className="w-8 h-8 text-orange-500" />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-600">Cash Payments</h3>
            <p className="text-2xl font-bold mt-2">{formatCurrency(totals?.Cash)}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-600">Card Payments</h3>
            <p className="text-2xl font-bold mt-2">{formatCurrency(totals?.Card)}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-600">Online Payments</h3>
            <p className="text-2xl font-bold mt-2">{formatCurrency(totals?.Online)}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
            <h3 className="text-sm font-medium text-gray-600">Total Income</h3>
            <p className="text-2xl font-bold mt-2">{formatCurrency(totals?.total)}</p>
          </div>
        </div>

        {/* Payment Tables */}
        <PaymentTable mode="Cash" />
        <PaymentTable mode="Card" />
        <PaymentTable mode="Online" />
      </div>
    </div>
  );
};

Income.adminRoute = true;
export default Income;
