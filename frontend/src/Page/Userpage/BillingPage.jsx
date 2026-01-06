import React, { useContext, useState, useMemo } from "react";
import { CategoryContext } from "../../context/CategoryContext";
import { ProductContext } from "../../context/ProductContext";
import { OrderContext } from "../../context/OrderContext";
import { AuthContext } from "../../context/AuthContext";

import {
  FaPlus,
  FaMinus,
  FaTrash,
  FaSearch,
  FaMoneyBill,
} from "react-icons/fa";

// ========================= SIMPLE TOAST =========================
function Toast({ message, type, onClose }) {
  if (!message) return null;

  const base =
    "fixed top-4 right-4 z-[1000] px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-3";
  const typeClass =
    type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white";

  return (
    <div className={`${base} ${typeClass}`}>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-xs underline decoration-white/70"
      >
        Close
      </button>
    </div>
  );
}

// ========================= CONFIRM POPUP =========================
function ConfirmPopup({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-[350px] rounded-xl shadow-lg p-5">
        <h2 className="text-xl font-bold text-center mb-2">Confirm Order</h2>
        <p className="text-center text-gray-600 mb-4">
          Are you sure you want to place this order?
        </p>

        <div className="flex justify-between mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded-lg text-sm font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold"
          >
            Yes, Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

// ========================= RECEIPT POPUP =========================
function ReceiptPopup({ order, onClose }) {
  const { user } = useContext(AuthContext);

  if (!order) return null;

  // ---------- PRINT RECEIPT ----------
  const handlePrint = () => {
    const content = document.getElementById("receipt-area").innerHTML;
    const win = window.open("", "_blank", "width=600,height=800");

    win.document.write(`
      <html>
      <head>
        <title>Receipt</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            padding: 20px;
            color: #000;
          }
          .text-center { text-align: center; }
          .header-title { font-size: 22px; font-weight: bold; }
          .meta { color: #555; font-size: 14px; margin: 2px 0; }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            margin: 15px 0 5px;
            border-bottom: 1px solid #000;
            padding-bottom: 4px;
          }
          .row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            font-size: 14px;
          }
          .total {
            font-size: 18px;
            font-weight: bold;
            border-top: 1px solid #000;
            margin-top: 10px;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `);

    win.document.close();
    win.print();

    // reload after print dialog is triggered
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // ---------- DOWNLOAD RECEIPT ----------
  const handleDownload = () => {
    const content =
      `RECEIPT\n\n` +
      `SHOP NAME: ${user?.shopname || "Your Shop Name"}\n` +
      `BILL NO: ${order.billNumber}\n` +
      `DATE: ${new Date(order.createdAt).toLocaleString()}\n\n` +
      `CUSTOMER DETAILS\n` +
      `------------------------\n` +
      `Name: ${order.customerName || "N/A"}\n` +
      `Phone: ${order.customerPhone || "N/A"}\n` +
      `Payment: ${order.paymentMethod}\n\n` +
      `ITEMS\n------------------------\n` +
      order.items
        .map((i) => `${i.productName} x ${i.quantity} = ₹${i.totalPrice}`)
        .join("\n") +
      `\n\n------------------------\n` +
      `Subtotal: ₹${order.subTotal}\n` +
      `Tax: ₹${order.taxAmount}\n` +
      `Discount: ${((order.subTotal * order.discountPercent) / 100).toFixed(
        2
      )}\n` +
      `TOTAL: ₹${order.totalAmount}\n`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Receipt_${order.billNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    // reload after download click is fired
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // ---------- CLOSE BUTTON ----------
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[430px] rounded-xl shadow-xl p-6">
        {/* ================= PRINTABLE SECTION ================= */}
        <div id="receipt-area" className="hidden print:block">
          <div className="text-center">
            <h2 className="header-title">{user?.shopname}</h2>
          </div>

          <p className="meta">Bill No: {order.billNumber}</p>
          <p className="meta">
            Date: {new Date(order.createdAt).toLocaleString()}
          </p>

          {/* CUSTOMER DETAILS */}
          <div className="section-title">Customer Details</div>

          <div className="row">
            <span>Name</span>
            <span>{order.customerName || "N/A"}</span>
          </div>

          <div className="row">
            <span>Phone</span>
            <span>{order.customerPhone || "N/A"}</span>
          </div>

          <div className="row">
            <span>Payment</span>
            <span>{order.paymentMethod}</span>
          </div>

          {/* ITEMS */}
          <div className="section-title">Items</div>

          {order.items.map((item) => (
            <div className="row" key={item.id}>
              <span>
                {item.productName} × {item.quantity}
              </span>
              <span>₹{item.totalPrice}</span>
            </div>
          ))}

          {/* SUMMARY */}
          <div className="section-title">Summary</div>

          <div className="row">
            <span>Subtotal</span>
            <span>₹{order.subTotal}</span>
          </div>

          <div className="row">
            <span>Tax</span>
            <span>₹{order.taxAmount}</span>
          </div>

          <div className="row">
            <span>Discount</span>
            <span>
              -₹{((order.subTotal * order.discountPercent) / 100).toFixed(2)}
            </span>
          </div>

          <div className="row total">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>

          <p
            className="meta"
            style={{ marginTop: "20px", textAlign: "center" }}
          >
            Thank you for your purchase!
          </p>
        </div>

        {/* ================= POPUP UI ================= */}
        <h2 className="text-2xl font-bold text-center">Receipt</h2>

        {/* CUSTOMER DETAILS IN POPUP */}
        <div className="mt-3 text-sm">
          <div className="flex justify-between">
            <span className="font-semibold">Customer:</span>
            <span>{order.customerName || "N/A"}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Phone:</span>
            <span>{order.customerPhone || "N/A"}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Payment:</span>
            <span>{order.paymentMethod}</span>
          </div>
        </div>

        {/* ITEMS */}
        <div className="mt-4 border-t border-b py-3 max-h-[200px] overflow-y-auto">
          {order.items.map((item) => (
            <div className="flex justify-between text-sm py-1" key={item.id}>
              <span>
                {item.productName} × {item.quantity}
              </span>
              <span>₹{item.totalPrice}</span>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="mt-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{order.subTotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{order.taxAmount}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span>
              -₹{((order.subTotal * order.discountPercent) / 100).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        {/* BUTTONS */}
        <button
          onClick={handleClose}
          className="w-full mt-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold"
        >
          Close
        </button>

        <button
          onClick={handlePrint}
          className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
        >
          Print Receipt
        </button>

        <button
          onClick={handleDownload}
          className="w-full mt-2 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-semibold"
        >
          Download Receipt
        </button>
      </div>
    </div>
  );
}

// ========================= MAIN BILLING PAGE =========================
export default function BillingPage() {
  const { categories } = useContext(CategoryContext);
  const { products, loading } = useContext(ProductContext);
  const { createOrder } = useContext(OrderContext);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [taxPercent, setTaxPercent] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  const [receipt, setReceipt] = useState(null);
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // toast state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const showToast = (msg, type = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // ---------------- VALIDATION ----------------
  const validateOrder = () => {
    const errors = {};

    if (customerPhone && !/^[0-9]{10}$/.test(customerPhone)) {
      errors.phone = "Phone must be a valid 10-digit number.";
    }

    if (taxPercent < 0) errors.tax = "Tax cannot be negative.";
    if (discountPercent < 0) errors.discount = "Discount cannot be negative.";
    if (discountPercent > 100) errors.discount = "Discount cannot exceed 100%.";

    if (cart.length === 0) {
      errors.cart = "Cart is empty.";
    }

    return errors;
  };

  // ---------------- PRODUCT COUNT BY CATEGORY ----------------
  const productCountsByCategory = useMemo(() => {
    const map = {};
    (products || []).forEach((p) => {
      map[p.categoryId] = (map[p.categoryId] || 0) + 1;
    });
    return map;
  }, [products]);

  const allItemsCount = (products || []).length;

  // ---------------- FILTER PRODUCTS ----------------
  const visibleProducts = useMemo(() => {
    let list = products || [];

    if (selectedCategoryId !== null) {
      list = list.filter((p) => p.categoryId === selectedCategoryId);
    }

    if (search.trim()) {
      const key = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(key));
    }

    return list;
  }, [products, selectedCategoryId, search]);

  // ---------------- CART HANDLERS (WITH STOCK CHECK) ----------------
  const addToCart = (product) => {
    const stock = product.stock ?? 0;

    if (stock <= 0) {
      showToast("This product is out of stock.", "error");
      return;
    }

    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        const newQty = exists.qty + 1;
        if (newQty > stock) {
          showToast(
            `Only ${stock} ${product.name} available in stock.`,
            "error"
          );
          return prev;
        }
        showToast(`${product.name} quantity updated in cart.`, "success");
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: newQty } : i
        );
      }

      showToast(`${product.name} added to cart.`, "success");
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.sellingPrice,
          qty: 1,
          stock,
        },
      ];
    });
  };

  const updateQty = (id, type) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;

      let newQty = item.qty;
      if (type === "inc") newQty += 1;
      else if (type === "dec") newQty -= 1;

      if (newQty > item.stock) {
        showToast(
          `Cannot exceed available stock of ${item.stock} for ${item.name}.`,
          "error"
        );
        return prev;
      }

      if (newQty <= 0) {
        showToast(`${item.name} removed from cart.`, "success");
        return prev.filter((i) => i.id !== id);
      }

      return prev.map((i) => (i.id === id ? { ...i, qty: newQty } : i));
    });
  };

  const removeItem = (id) => {
    const item = cart.find((i) => i.id === id);
    if (item) {
      showToast(`${item.name} removed from cart.`, "success");
    }
    setCart(cart.filter((i) => i.id !== id));
  };

  // ---------------- TOTAL CALCULATIONS ----------------
  const subtotal = cart.reduce((s, i) => s + i.qty * i.price, 0);
  const taxAmount = (subtotal * taxPercent) / 100;
  const discountAmount = (subtotal * discountPercent) / 100;
  const grandTotal = subtotal + taxAmount - discountAmount;

  // ---------------- PLACE ORDER ----------------
  const placeOrder = async () => {
    if (cart.length === 0) return;

    const payload = {
      customerName,
      customerPhone,
      taxPercent,
      taxAmount,
      discountPercent,
      discountAmount,
      paymentMethod,

      items: cart.map((i) => ({
        productId: i.id,
        quantity: i.qty,
      })),
    };

    try {
      const order = await createOrder(payload);
      setReceipt(order);
      showToast("Order placed successfully.", "success");

      // RESET UI
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
      setTaxPercent(0);
      setDiscountPercent(0);
      setPaymentMethod("CASH");
      // No reload here – reload will happen after user clicks
      // Close / Print / Download in the receipt popup
    } catch (err) {
      console.error("Order failed:", err);
      showToast("Order could not be placed.", "error");
    }
  };

  const normalizeNumberInput = (value) => {
    if (value === "") return "";
    return String(Number(value));
  };

  // ========================== UI ==========================
  return (
    <>
      <div className="w-full h-[95vh] bg-gray-100 flex gap-4 overflow-hidden poppins">
        {/* LEFT SECTION */}
        <div className="flex-1 bg-white rounded-xl shadow-lg border border-green-300 p-4 flex flex-col overflow-hidden">
          {/* CATEGORY FILTERS */}
          <div className="flex items-center gap-3 overflow-x-auto pb-3">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`min-w-[150px] px-4 py-3 rounded-lg shadow border font-medium transition
              ${
                selectedCategoryId === null
                  ? "bg-green-600 border-green-700 text-white"
                  : "bg-white border-green-300 text-gray-700"
              }`}
            >
              All Items ({allItemsCount})
            </button>

            {categories.map((c) => {
              const count = productCountsByCategory[c.id] || 0;
              const active = selectedCategoryId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategoryId(c.id)}
                  className={`min-w-[180px] px-4 py-3 rounded-lg shadow border font-medium transition flex items-center justify-between
                  ${
                    active
                      ? "bg-green-600 border-green-700 text-white"
                      : "bg-white border-green-300 text-gray-700"
                  }`}
                >
                  <span className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap block">
                    {c.name}
                  </span>

                  <span className="text-xs opacity-80 whitespace-nowrap">
                    ({count} items)
                  </span>
                </button>
              );
            })}
          </div>

          {/* SEARCH BAR */}
          <div className="mt-4 mb-3 w-full max-w-sm">
            <div className="flex items-center bg-white px-4 py-2 rounded-lg border border-green-300 shadow-sm">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items..."
                className="bg-transparent outline-none w-full text-sm text-gray-800"
              />
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div className="flex-1 overflow-y-auto pr-2 mt-2">
            {loading && <p className="text-gray-500">Loading...</p>}

            {formErrors.cart && (
              <p className="text-red-600 text-sm mb-2">{formErrors.cart}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {visibleProducts.map((p) => {
                const stock = p.stock ?? 0;
                const cartItem = cart.find((i) => i.id === p.id);
                const cartQty = cartItem?.qty || 0;
                const remaining = stock - cartQty;

                const isOutOfStock = stock <= 0;
                const lowStockThreshold = 5; // change if you want
                const isLowStock =
                  remaining <= lowStockThreshold && remaining > 0;

                const baseBtn =
                  "mt-3 w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2";
                const btnColorClass = isOutOfStock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isLowStock
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white";

                return (
                  <div
                    key={p.id}
                    onClick={() => !isOutOfStock && addToCart(p)}
                    className={`cursor-pointer border shadow-sm rounded-xl p-4 transition ${
                      isOutOfStock
                        ? "bg-gray-50 border-gray-300 opacity-60 cursor-not-allowed"
                        : "bg-white border-green-300 hover:shadow-md hover:border-green-500"
                    }`}
                  >
                    <p className="text-xs text-gray-500">{p.categoryName}</p>

                    <h3 className="text-md font-semibold mt-1 text-gray-900">
                      {p.name}
                    </h3>

                    <p className="text-green-700 font-bold text-lg mt-3">
                      ₹{p.sellingPrice}
                    </p>

                    <button
                      disabled={isOutOfStock}
                      className={`${baseBtn} ${btnColorClass}`}
                    >
                      {isOutOfStock ? (
                        "+ Add to Cart"
                      ) : (
                        <>
                          <FaPlus /> Add
                        </>
                      )}
                    </button>

                    {/* STOCK / LOW STOCK MESSAGE */}
                    {!isOutOfStock && remaining > 0 ? (
                      <>
                        {/* If NOT low stock, show normal stock line */}
                        {!isLowStock && (
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            Stock: {stock}{" "}
                            {cartQty > 0 && `(In cart: ${cartQty})`}
                          </p>
                        )}

                        {/* If low stock, hide normal stock line and show only this */}
                        {isLowStock && (
                          <p className="text-sm font-semibold text-orange-600 text-center mt-2">
                            Low stock: {remaining} left
                            {cartQty > 0 && ` (In cart: ${cartQty})`}
                          </p>
                        )}
                      </>
                    ) : (
                      // Out of stock: show only this, no normal stock line
                      <p className="text-sm font-semibold text-red-600 text-center mt-2">
                        Out of stock
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT CART SECTION */}
        <div className="w-[380px] bg-white rounded-xl shadow-lg border border-green-300 p-4 flex flex-col overflow-hidden">
          {/* CUSTOMER INFO */}
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-900">
              Customer
            </h2>

            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer name"
              className="w-full mb-2 px-3 py-2 bg-white border border-green-300 rounded-lg outline-none text-sm shadow-sm"
            />

            <input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Mobile number"
              className="w-full px-3 py-2 bg-white border border-green-300 rounded-lg outline-none text-sm shadow-sm"
            />

            {formErrors.phone && (
              <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>
            )}
          </div>

          {/* CART ITEMS */}
          <div className="flex-1 mt-4 overflow-y-auto pr-1 border-t border-b border-green-300 py-3">
            {cart.length === 0 && (
              <p className="text-center text-sm text-gray-500">Cart is empty</p>
            )}

            {cart.map((item) => (
              <div
                key={item.id}
                className="border-b border-gray-200 py-3 flex justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    ₹{item.price} × {item.qty}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Stock: {item.stock}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.id, "dec")}
                    className="w-7 h-7 flex items-center justify-center rounded bg-red-500 text-white"
                  >
                    <FaMinus />
                  </button>

                  <span>{item.qty}</span>

                  <button
                    onClick={() => updateQty(item.id, "inc")}
                    className="w-7 h-7 flex items-center justify-center rounded bg-blue-500 text-white"
                  >
                    <FaPlus />
                  </button>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-7 h-7 flex items-center justify-center rounded bg-red-600 text-white ml-1"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* BILL SUMMARY */}
          <div className="mt-3 text-gray-900 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Tax (%)</span>
              <input
                type="number"
                value={taxPercent}
                onChange={(e) =>
                  setTaxPercent(normalizeNumberInput(e.target.value))
                }
                className="w-16 px-2 py-1 bg-white border border-green-300 rounded-lg shadow-sm"
              />
            </div>
            {formErrors.tax && (
              <p className="text-xs text-red-600">{formErrors.tax}</p>
            )}

            <div className="flex justify-between items-center">
              <span>Discount (%)</span>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) =>
                  setDiscountPercent(normalizeNumberInput(e.target.value))
                }
                className="w-16 px-2 py-1 bg-white border border-green-300 rounded-lg shadow-sm"
              />
            </div>
            {formErrors.discount && (
              <p className="text-xs text-red-600">{formErrors.discount}</p>
            )}

            <div className="flex justify-between text-gray-600 pt-1">
              <span>Tax Amount</span>
              <span>₹{taxAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Discount</span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-green-300">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* PAYMENT BUTTONS */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-800">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-white border border-green-300 rounded-lg outline-none text-sm shadow-sm"
            >
              <option value="CASH">Cash</option>
              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
              <option value="CREDIT">Credit</option>
            </select>

            <button
              disabled={cart.length === 0}
              onClick={() => {
                const errors = validateOrder();
                setFormErrors(errors);

                if (Object.keys(errors).length === 0) {
                  setConfirmPopup(true);
                }
              }}
              className={`w-full py-2 mt-3 rounded-lg font-bold flex items-center justify-center gap-2 ${
                cart.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-yellow-400 text-black hover:bg-yellow-500"
              }`}
            >
              <FaMoneyBill /> Place Order
            </button>
          </div>
        </div>

        {/* CONFIRM POPUP */}
        {confirmPopup && (
          <ConfirmPopup
            onConfirm={() => {
              setConfirmPopup(false);
              placeOrder();
            }}
            onCancel={() => setConfirmPopup(false)}
          />
        )}

        {/* RECEIPT POPUP */}
        <ReceiptPopup order={receipt} onClose={() => setReceipt(null)} />
      </div>

      {/* TOAST */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage("")}
      />
    </>
  );
}
