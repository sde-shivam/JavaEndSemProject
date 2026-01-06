function ReceiptPopup({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-xl shadow-lg p-5">

        <h2 className="text-xl font-bold text-center mb-2">Invoice</h2>
        <p className="text-center text-gray-600 mb-4">Bill No: {order.billNumber}</p>

        <div className="border-t border-b py-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-1">
              <span>{item.productName} × {item.quantity}</span>
              <span>₹{item.totalPrice}</span>
            </div>
          ))}
        </div>

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
            <span>-₹{order.discountAmount}</span>
          </div>

          <div className="flex justify-between font-bold text-lg mt-2 border-t pt-2">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
}
