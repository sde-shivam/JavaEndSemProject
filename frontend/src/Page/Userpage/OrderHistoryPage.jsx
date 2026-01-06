import React, { useEffect, useState, useContext, useMemo } from "react";
import { OrderContext } from "../../context/OrderContext.jsx";
import OrderDetailsModal from "../../Component/OrderDetailsModal.jsx";
import { FaSearch } from "react-icons/fa";

export default function OrderHistoryPage() {
  const { orders, loading, getMyOrders } = useContext(OrderContext);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState("TODAY");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [customDate, setCustomDate] = useState("");

  // Fetch orders once
  useEffect(() => {
    getMyOrders();
  }, [getMyOrders]);

  // ------------------ DATE FILTER LOGIC ------------------
  const isWithinDate = (orderDate, filterType) => {
    if (filterType === "ALL") return true;

    const d = new Date(orderDate);
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfToday.getDate() - 1);

    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(startOfToday.getDate() - 7);

    const thirtyDaysAgo = new Date(startOfToday);
    thirtyDaysAgo.setDate(startOfToday.getDate() - 30);

    // CUSTOM: exact selected date
    if (filterType === "CUSTOM" && customDate) {
      const selected = new Date(customDate);
      return d.toDateString() === selected.toDateString();
    }

    switch (filterType) {
      case "TODAY":
        return d >= startOfToday;
      case "YESTERDAY":
        return d >= startOfYesterday && d < startOfToday;
      case "7DAYS":
        return d >= sevenDaysAgo;
      case "30DAYS":
        return d >= thirtyDaysAgo;
      default:
        return true;
    }
  };

  // ------------------ FILTER + SEARCH LOGIC ------------------
  const filteredOrders = useMemo(() => {
    const list = orders || [];
    const key = searchText.trim().toLowerCase();

    return list
      .filter((o) => {
        // date filter
        if (!isWithinDate(o.createdAt, dateFilter)) return false;

        // payment filter
        if (paymentFilter !== "ALL" && o.paymentMethod !== paymentFilter)
          return false;

        // search filter
        if (key.length > 0) {
          const bill = (o.billNumber || "").toLowerCase();
          const name = (o.customerName || "").toLowerCase();
          const idStr = String(o.id || "");
          if (
            bill.includes(key) ||
            name.includes(key) ||
            idStr.includes(key)
          ) {
            return true;
          }
          return false;
        }

        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest first
  }, [orders, searchText, dateFilter, paymentFilter, customDate]);

  // ------------------ PAYMENT BADGES ------------------
  const getPaymentBadge = (method) => {
    const base =
      "px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap";

    switch (method) {
      case "CASH":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>Cash</span>
        );
      case "UPI":
        return (
          <span className={`${base} bg-blue-100 text-blue-700`}>UPI</span>
        );
      case "CARD":
        return (
          <span className={`${base} bg-purple-100 text-purple-700`}>Card</span>
        );
      default:
        return (
          <span className={`${base} bg-gray-200 text-gray-700`}>
            {method}
          </span>
        );
    }
  };

  return (
    <div className="p-2 poppins bg-gray-100 min-h-[90vh]">
      <h1 className="text-3xl font-bold mb-4">
        Order <span className="text-green-700">history</span>
      </h1>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white p-4 rounded-xl shadow border border-green-300 mb-6 flex flex-wrap gap-4 items-center">
        {/* SEARCH */}
        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg border border-green-300 w-full sm:w-[360px]">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search Bill No / Customer / Order ID"
            className="bg-transparent outline-none w-full text-sm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* DATE FILTER */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-green-300 rounded-lg bg-white text-gray-700 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="TODAY">Today</option>
            <option value="YESTERDAY">Yesterday</option>
            <option value="7DAYS">Last 7 Days</option>
            <option value="30DAYS">Last 30 Days</option>
            <option value="ALL">All Orders</option>
            <option value="CUSTOM">Custom Date</option>
          </select>

          {dateFilter === "CUSTOM" && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="px-3 py-2 border border-green-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          )}
        </div>

        {/* PAYMENT FILTER */}
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-4 py-2 border border-green-300 rounded-lg bg-white text-gray-700 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="ALL">All Payments</option>
          <option value="CASH">Cash</option>
          <option value="UPI">UPI</option>
          <option value="CARD">Card</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white p-6 rounded-xl shadow border border-green-300">
        {/* HEADER */}
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left w-[130px]">Bill No</th>
              <th className="px-4 py-3 text-left w-[150px]">Customer</th>
              <th className="px-4 py-3 text-left w-[120px]">Amount</th>
              <th className="px-4 py-3 text-left w-[120px]">Payment</th>
              <th className="px-4 py-3 text-left w-[170px]">Date</th>
              <th className="px-4 py-3 text-center w-[120px]">Action</th>
            </tr>
          </thead>
        </table>

        {/* BODY SCROLL */}
        <div className="h-[400px] overflow-y-auto">
          <table className="w-full text-sm border-collapse">
            <tbody>
              {/* Loading */}
              {loading && (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              )}

              {/* No Orders */}
              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="py-6 text-center text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              )}

              {/* Orders */}
              {!loading &&
                filteredOrders.map((o) => {
                  const created = new Date(o.createdAt);
                  return (
                    <tr
                      key={o.id}
                      className="border-b border-gray-200 hover:bg-green-50 transition"
                    >
                      <td className="px-4 py-3 font-medium text-gray-700 w-[130px]">
                        {o.billNumber}
                      </td>

                      <td className="px-4 py-3 text-gray-700 w-[150px]">
                        {o.customerName || "Walk-in Customer"}
                      </td>

                      <td className="px-4 py-3 text-green-700 font-semibold w-[120px]">
                        ₹{o.totalAmount}
                      </td>

                      <td className="px-4 py-3 w-[120px]">
                        {getPaymentBadge(o.paymentMethod)}
                      </td>

                      <td className="px-4 py-3 text-gray-700 w-[170px]">
                        {created.toLocaleDateString()}{" "}
                        {created.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="px-4 py-3 w-[120px] text-center">
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700"
                          onClick={() => setSelectedOrder(o)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILS POPUP */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
