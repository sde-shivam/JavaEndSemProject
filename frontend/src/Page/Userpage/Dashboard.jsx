import React, { useContext, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext";
import { OrderContext } from "../../context/OrderContext";
import { ProductContext } from "../../context/ProductContext";

import {
  FaShoppingCart,
  FaRupeeSign,
  FaClock,
} from "react-icons/fa";

import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { orders } = useContext(OrderContext);
  const { products } = useContext(ProductContext);

  // -------------------------------------------------------
  // TODAY'S SALES & TODAY'S ORDERS
  // -------------------------------------------------------
  const today = new Date().toISOString().split("T")[0];

  const todaysOrders = useMemo(
    () => orders.filter((o) => o.createdAt.startsWith(today)),
    [orders, today]
  );

  const todaysRevenue = useMemo(
    () => todaysOrders.reduce((sum, o) => sum + o.totalAmount, 0),
    [todaysOrders]
  );

  // -------------------------------------------------------
  // 7-DAY REVENUE GRAPH
  // -------------------------------------------------------
  const last7 = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    }).reverse();
  }, []);

  const revenue7Days = useMemo(
    () =>
      last7.map((day) =>
        orders
          .filter((o) => o.createdAt.startsWith(day))
          .reduce((sum, o) => sum + o.totalAmount, 0)
      ),
    [orders, last7]
  );

  const graphData = {
    labels: last7,
    datasets: [
      {
        label: "Revenue (7 Days)",
        data: revenue7Days,
        borderColor: "#16a34a",
        backgroundColor: "rgba(34,197,94,0.25)",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  const graphOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `₹${ctx.raw?.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { maxRotation: 0, minRotation: 0 },
      },
      y: {
        ticks: {
          callback: (value) => `₹${value}`,
        },
      },
    },
    maintainAspectRatio: false,
  };

  // -------------------------------------------------------
  // TOP SELLING PRODUCTS
  // -------------------------------------------------------
  const saleMap = {};

  orders.forEach((o) => {
    o.items?.forEach((it) => {
      const qty = it.qty ?? it.quantity ?? 0;
      saleMap[it.productId] = (saleMap[it.productId] || 0) + qty;
    });
  });

  const topSellingProducts = useMemo(
    () =>
      Object.entries(saleMap)
        .map(([pid, sold]) => {
          const product = products.find((p) => p.id == pid);
          if (!product) return null;
          return {
            id: product.id,
            name: product.name,
            categoryName: product.categoryName,
            sellingPrice: product.sellingPrice,
            totalSold: sold,
            stock: product.stock,
            lowStockAlert: product.lowStockAlert,
          };
        })
        .filter(Boolean)
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 20), // show more but scrollable
    [products, saleMap]
  );

  // -------------------------------------------------------
  // LOW STOCK PRODUCTS
  // -------------------------------------------------------
  const lowStockProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.lowStockAlert != null &&
          p.lowStockAlert > 0 &&
          p.stock <= p.lowStockAlert
      ),
    [products]
  );

  // -------------------------------------------------------
  // RECENT ORDERS (TOP 8)
  // -------------------------------------------------------
  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8),
    [orders]
  );

  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------
  return (
    <div className="poppins text-gray-900 p-6 space-y-8">
      {/* GREETING */}
      <h1 className="text-3xl font-bold mb-2">
        Welcome, <span className="text-green-700">{user?.shopname}</span>
      </h1>
      <p className="text-sm text-gray-500 mb-4">
        Overview of your sales performance, top products and inventory health.
      </p>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Revenue Today */}
        <div className="bg-white p-6 rounded-xl shadow border border-green-200 flex items-center gap-4">
          <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center">
            <FaRupeeSign className="text-green-600 text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Today's Revenue</p>
            <p className="text-3xl font-bold">₹{todaysRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Orders Today */}
        <div className="bg-white p-6 rounded-xl shadow border border-green-200 flex items-center gap-4">
          <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center">
            <FaShoppingCart className="text-green-600 text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Today's Orders</p>
            <p className="text-3xl font-bold">{todaysOrders.length}</p>
          </div>
        </div>

        {/* Avg Order Value */}
        <div className="bg-white p-6 rounded-xl shadow border border-green-200 flex items-center gap-4">
          <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center">
            <FaClock className="text-green-600 text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg. Order Value (Today)</p>
            <p className="text-3xl font-bold">
              ₹
              {todaysOrders.length
                ? (todaysRevenue / todaysOrders.length).toFixed(2)
                : "0.00"}
            </p>
          </div>
        </div>
      </div>

      {/* 7 DAY REVENUE GRAPH */}
      <div className="bg-white p-6 rounded-xl shadow border border-green-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Last 7 Days Revenue
        </h2>
        <div className="h-64">
          <Line data={graphData} options={graphOptions} />
        </div>
      </div>

      {/* TOP SELLING + LOW STOCK GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* TOP SELLING PRODUCTS GRID */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Top Selling Products</h2>
            <p className="text-xs text-gray-500">
              Based on all recorded orders
            </p>
          </div>

          {topSellingProducts.length === 0 && (
            <p className="text-gray-600 text-sm">
              No sales data yet. Start billing to see top sellers here.
            </p>
          )}

          {/* FIXED HEIGHT + SCROLL */}
          <div className="max-h-[350px] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topSellingProducts.map((p) => {
                const isLowStock =
                  p.lowStockAlert != null &&
                  p.lowStockAlert > 0 &&
                  p.stock <= p.lowStockAlert;
                const outOfStock = p.stock <= 0;

                return (
                  <div
                    key={p.id}
                    className="bg-white p-4 rounded-xl shadow border border-green-200 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {p.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {p.categoryName}
                      </p>
                      <p className="mt-1 text-gray-600 text-xs">
                        Price: ₹{p.sellingPrice}
                      </p>
                      <p className="mt-1 text-green-700 font-semibold text-sm">
                        Sold: {p.totalSold}
                      </p>

                      <div className="mt-2">
                        {outOfStock ? (
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                            Low Stock: {p.stock} left
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                            In Stock: {p.stock}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* LOW STOCK ITEMS */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Low Stock Items</h2>

          <div className="max-h-[350px] overflow-y-auto border border-red-300 rounded-xl">
            {lowStockProducts.length === 0 && (
              <p className="p-4 text-gray-600 text-sm">
                No low stock items right now.
              </p>
            )}

            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="border-b border-red-200 p-4 bg-white flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <p className="text-xs text-gray-500">{p.categoryName}</p>
                  <p className="text-sm text-gray-600">
                    Stock: {p.stock} / Alert at {p.lowStockAlert}
                  </p>
                </div>
                {p.stock <= 0 ? (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                    Out of Stock
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                    Low: {p.stock} left
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT ORDERS FULL TABLE */}
      <div className="bg-white p-6 rounded-xl shadow border border-green-200 w-full">
        <div className="flex items-center gap-2 text-gray-700 text-lg mb-4">
          <FaClock className="text-green-600" />
          <span className="font-semibold">Recent Orders</span>
        </div>

        <div className="w-full border border-green-200 rounded-lg overflow-hidden">
          {/* HEADER */}
          <table className="w-full text-sm border-collapse">
            <thead className="bg-green-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left w-[120px]">Order ID</th>
                <th className="px-4 py-3 text-left w-[200px]">Customer</th>
                <th className="px-4 py-3 text-center w-[120px]">Items</th>
                <th className="px-4 py-3 text-center w-[150px]">Amount</th>
                <th className="px-4 py-3 text-center w-[150px]">Payment</th>
                <th className="px-4 py-3 text-center w-[200px]">Time</th>
              </tr>
            </thead>
          </table>

          {/* SCROLLABLE BODY */}
          <div className="max-h-[350px] overflow-y-auto w-full">
            <table className="w-full text-sm border-collapse">
              <tbody>
                {recentOrders.map((o) => {
                  const d = new Date(o.createdAt);
                  return (
                    <tr
                      key={o.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 font-semibold w-[120px] text-left">
                        #{o.id}
                      </td>

                      <td className="px-4 py-3 w-[200px] text-left">
                        {o.customerName || "Walk-in User"}
                      </td>

                      <td className="px-4 py-3 w-[120px] text-center">
                        {o.items?.length}
                      </td>

                      <td className="px-4 py-3 w-[150px] text-center text-green-700 font-bold">
                        ₹{o.totalAmount}
                      </td>

                      <td className="px-4 py-3 w-[150px] text-center">
                        {o.paymentMethod}
                      </td>

                      <td className="px-4 py-3 w-[200px] text-center">
                        {d.toLocaleDateString()} •{" "}
                        {d.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })}

                {recentOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
