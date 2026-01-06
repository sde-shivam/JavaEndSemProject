import React, { useContext, useMemo, useState } from "react";
import { OrderContext } from "../../context/OrderContext";
import { ProductContext } from "../../context/ProductContext";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProductSalesReport() {
  const { orders } = useContext(OrderContext);
  const { products } = useContext(ProductContext);

  const [range, setRange] = useState("7DAYS"); // TODAY, 7DAYS, MONTH, CUSTOM
  const [customDate, setCustomDate] = useState("");

  // ---------------- DATE RANGE ----------------
  const isInRange = (date) => {
    const d = new Date(date);
    const today = new Date();

    const todayStr = today.toDateString();
    const dStr = d.toDateString();

    if (range === "TODAY") {
      return dStr === todayStr;
    }

    if (range === "7DAYS") {
      const last7 = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 7
      );
      return d >= last7;
    }

    if (range === "MONTH") {
      return (
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    }

    if (range === "CUSTOM" && customDate) {
      const selected = new Date(customDate);
      return d.toDateString() === selected.toDateString();
    }

    return true;
  };

  // ---------------- PRODUCT SALES MAP ----------------
  const productSales = useMemo(() => {
    const map = {};

    (orders || [])
      .filter((o) => isInRange(o.createdAt))
      .forEach((o) => {
        (o.items || []).forEach((i) => {
          const pid = i.productId;
          const qty =
            i.quantity != null
              ? i.quantity
              : i.qty != null
              ? i.qty
              : 0;
          map[pid] = (map[pid] || 0) + qty;
        });
      });

    return map;
  }, [orders, range, customDate]);

  // ---------------- MERGED PRODUCT DATA ----------------
  const reportData = useMemo(() => {
    return (products || [])
      .map((p) => {
        const sold = productSales[p.id] || 0;
        return {
          ...p,
          sold,
          revenue: sold * (p.sellingPrice || 0),
        };
      })
      .filter((p) => p.sold > 0)
      .sort((a, b) => b.sold - a.sold);
  }, [products, productSales]);

  // ------------- CATEGORY LEVEL AGGREGATION -------------
  const categorySales = useMemo(() => {
    const map = {};
    reportData.forEach((p) => {
      const key = p.categoryName || "Uncategorized";
      if (!map[key]) {
        map[key] = { sold: 0, revenue: 0 };
      }
      map[key].sold += p.sold;
      map[key].revenue += p.revenue;
    });
    return map;
  }, [reportData]);

  // ---------------- SUMMARY ----------------
  const totalSold = reportData.reduce((s, p) => s + p.sold, 0);
  const totalRevenue = reportData.reduce((s, p) => s + p.revenue, 0);

  // ---------------- PIE DATA: PRODUCTS ----------------
  const productPieData = useMemo(() => {
    const top = reportData.slice(0, 8);
    const labels = top.map((p) => p.name);
    const values = top.map((p) => p.sold);

    const colors = [
      "#22c55e",
      "#3b82f6",
      "#f97316",
      "#e11d48",
      "#a855f7",
      "#06b6d4",
      "#84cc16",
      "#facc15",
    ];

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 1,
        },
      ],
    };
  }, [reportData]);

  // ---------------- PIE DATA: CATEGORIES ----------------
  const categoryPieData = useMemo(() => {
    const entries = Object.entries(categorySales);
    const labels = entries.map(([name]) => name);
    const values = entries.map(([, val]) => val.sold);

    const colors = [
      "#22c55e",
      "#3b82f6",
      "#f97316",
      "#e11d48",
      "#a855f7",
      "#06b6d4",
      "#84cc16",
      "#facc15",
    ];

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 1,
        },
      ],
    };
  }, [categorySales]);

  const pieOptions = {
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.label || "";
            const value = ctx.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="poppins p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">
          Product Sales Report
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-4 py-2 border border-green-400 rounded-lg bg-white text-sm"
          >
            <option value="TODAY">Today</option>
            <option value="7DAYS">Last 7 Days</option>
            <option value="MONTH">This Month</option>
            <option value="CUSTOM">Custom Date</option>
          </select>

          {range === "CUSTOM" && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="px-3 py-2 border border-green-400 rounded-lg bg-white text-sm"
            />
          )}
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Summary title="Products Sold" value={totalSold} />
        <Summary
          title="Total Revenue"
          value={`₹${totalRevenue.toFixed(2)}`}
        />
        <Summary title="Unique Products" value={reportData.length} />
      </div>

      {/* PIE CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* PRODUCT PIE */}
        <div className="bg-white rounded-xl shadow border border-green-300 p-6">
          <h2 className="font-semibold mb-4 text-gray-700">
            Sales Share by Product
          </h2>
          {reportData.length === 0 ? (
            <p className="text-sm text-gray-500">
              No sales for selected range.
            </p>
          ) : (
            <div className="h-64">
              <Pie data={productPieData} options={pieOptions} />
            </div>
          )}
        </div>

        {/* CATEGORY PIE */}
        <div className="bg-white rounded-xl shadow border border-green-300 p-6">
          <h2 className="font-semibold mb-4 text-gray-700">
            Sales Share by Category
          </h2>
          {Object.keys(categorySales).length === 0 ? (
            <p className="text-sm text-gray-500">
              No category data for selected range.
            </p>
          ) : (
            <div className="h-64">
              <Pie data={categoryPieData} options={pieOptions} />
            </div>
          )}
        </div>
      </div>

      {/* PRODUCT TABLE (same as before, left aligned) */}
      <div className="bg-white rounded-xl shadow border border-green-300 p-6">
        <h2 className="font-semibold mb-4 text-gray-700">
          Detailed Product Sales
        </h2>

        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-green-50">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Sold</th>
                <th className="p-3 text-left">Revenue</th>
                <th className="p-3 text-left">Stock</th>
              </tr>
            </thead>

            <tbody>
              {reportData.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-3 text-left">{p.name}</td>
                  <td className="p-3 text-left">{p.categoryName}</td>
                  <td className="p-3 text-left font-semibold">{p.sold}</td>
                  <td className="p-3 text-left text-green-700">
                    ₹{p.revenue.toFixed(2)}
                  </td>
                  <td className="p-3 text-left">
                    {p.lowStockAlert != null &&
                    p.lowStockAlert > 0 &&
                    p.stock <= p.lowStockAlert ? (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                        LOW ({p.stock})
                      </span>
                    ) : (
                      p.stock
                    )}
                  </td>
                </tr>
              ))}
              {reportData.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-4 text-left text-gray-500"
                  >
                    No data for selected date/range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Summary({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow border border-green-300">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
