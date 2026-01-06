import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function OrderDetailsModal({ order, onClose }) {

    const { user, logout } = useContext(AuthContext);
  if (!order) return null;

  // ---------------- PRINT INVOICE ----------------
  const handlePrint = () => {
    const content = document.getElementById("invoice-print-area").innerHTML;
    const win = window.open("", "_blank", "width=600,height=800");

    win.document.write(`
      <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 15px; }
          .header h2 { margin: 0; font-size: 24px; }
          .meta { color: #555; font-size: 14px; margin: 2px 0; }
          .section-title {
            font-size: 16px; font-weight: bold;
            margin-top: 15px; border-bottom: 1px solid #000; padding-bottom: 5px;
          }
          .row { display: flex; justify-content: space-between; padding: 4px 0; }
          .total {
            font-weight: bold; font-size: 18px;
            border-top: 1px solid #000; padding-top: 10px; margin-top: 10px;
          }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  // ---------------- DOWNLOAD INVOICE ----------------
  const handleDownload = () => {
    const txt =
      `INVOICE\n\n` +
      `Bill No: ${order.billNumber}\n` +
      `Date: ${new Date(order.createdAt).toLocaleString()}\n\n` +
      `CUSTOMER\n-------------\n` +
      `Name: ${order.customerName || "Walk-in Customer"}\n` +
      `Phone: ${order.customerPhone || "-"}\n` +
      `Payment: ${order.paymentMethod}\n\n` +
      `ITEMS\n-------------\n` +
      order.items
        .map(
          (i) => `${i.productName} × ${i.quantity} = ₹${i.totalPrice}`
        )
        .join("\n") +
      `\n\n-------------\n` +
      `Subtotal: ₹${order.subTotal}\n` +
      `Tax: ₹${order.taxAmount}\n` +
      `Discount: ₹${(
        (order.subTotal * order.discountPercent) /
        100
      ).toFixed(2)}\n` +
      `TOTAL: ₹${order.totalAmount}\n`;

    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice_${order.billNumber}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] rounded-xl shadow-lg p-6 max-h-[85vh] overflow-y-auto">

        <h2 className="text-2xl font-bold text-center mb-3">Order Details</h2>
        <p className="text-center text-gray-600 mb-4">Bill No: {order.billNumber}</p>

        {/* ================= PRINT CONTENT =============== */}
        <div id="invoice-print-area" className="hidden print:block">

          <div className="header">
            <h2>{user.shopname}</h2>
            <p className="meta">JAI SHREE RAM</p>
          </div>

          <p className="meta">Bill No: {order.billNumber}</p>
          <p className="meta">Date: {new Date(order.createdAt).toLocaleString()}</p>

          <div className="section-title">Customer Details</div>

          <div className="row"><span>Name</span><span>{order.customerName || "Walk-in Customer"}</span></div>
          <div className="row"><span>Phone</span><span>{order.customerPhone || "-"}</span></div>
          <div className="row"><span>Payment</span><span>{order.paymentMethod}</span></div>

          <div className="section-title">Items</div>
          {order.items.map((item) => (
            <div className="row" key={item.id}>
              <span>{item.productName} × {item.quantity}</span>
              <span>₹{item.totalPrice}</span>
            </div>
          ))}

          <div className="section-title">Summary</div>
          <div className="row"><span>Subtotal</span><span>₹{order.subTotal}</span></div>
          <div className="row"><span>Tax</span><span>₹{order.taxAmount}</span></div>
          <div className="row">
            <span>Discount</span>
            <span>-₹{((order.subTotal * order.discountPercent) / 100).toFixed(2)}</span>
          </div>

          <div className="row total">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>

          <p className="meta" style={{ marginTop: "15px", textAlign: "center" }}>
            Thank you for your purchase!
          </p>
        </div>

        {/* ================= UI DISPLAY =============== */}
        {/* CUSTOMER INFO */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Customer Info</h3>
          <p>Name: {order.customerName || "Walk-in Customer"}</p>
          <p>Phone: {order.customerPhone || "-"}</p>
          <p>Payment: {order.paymentMethod}</p>
        </div>

        {/* ITEMS LIST */}
        <div className="border-t border-b py-3 mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Items</h3>

          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-1 border-b last:border-0">
              <span>{item.productName} × {item.quantity}</span>
              <span>₹{item.totalPrice}</span>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="text-sm space-y-1 mb-4">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subTotal}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>₹{order.taxAmount}</span></div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-₹{((order.subTotal * order.discountPercent) / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        {/* ================= BUTTONS =============== */}
        <button
          onClick={onClose}
          className="w-full py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold"
        >
          Close
        </button>

        <button
          onClick={handlePrint}
          className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
        >
          Print Invoice
        </button>

      
      </div>
    </div>
  );
}
