import React, { useContext, useMemo, useState } from "react";
import { ProductContext } from "../../context/ProductContext";
import { CategoryContext } from "../../context/CategoryContext";
import { FaTrash, FaEdit, FaBox, FaSearch } from "react-icons/fa";

/* =============== SIMPLE TOAST =============== */
function Toast({ message, type, onClose }) {
  if (!message) return null;

  const base =
    "fixed top-4 right-4 z-[1000] px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-3";
  const typeClass =
    type === "success"
      ? "bg-green-600 text-white"
      : "bg-red-600 text-white";

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

/* =============== CONFIRM DELETE POPUP =============== */
function ConfirmDelete({ open, name, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[900]">
      <div className="bg-white rounded-xl shadow-xl w-[340px] p-5">
        <h2 className="text-lg font-bold text-center mb-2">
          Delete Product
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{name}</span>?<br />
          This action cannot be undone.
        </p>

        <div className="flex justify-between mt-2 gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { products = [], loading, addProduct, updateProduct, deleteProduct } =
    useContext(ProductContext);
  const { categories = [] } = useContext(CategoryContext);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [stock, setStock] = useState("");
  const [lowStockAlert, setLowStockAlert] = useState("");
  const [description, setDescription] = useState("");
  const [barcode, setBarcode] = useState("");

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);
  const [sortOption, setSortOption] = useState("newest");

  // category filter for list
  const [filterCategoryId, setFilterCategoryId] = useState("all");

  // toast
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");

  // confirm delete
  const [deleteTarget, setDeleteTarget] = useState(null); // {id, name} | null

  const showToast = (msg, type = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(""), 2500);
  };

  // ================= VALIDATION =================
  const validate = () => {
    const e = {};

    if (!name.trim()) e.name = "Product name is required.";
    if (!categoryId) e.categoryId = "Category is required.";

    const cp = parseFloat(costPrice);
    const sp = parseFloat(sellingPrice);
    const st = parseInt(stock, 10);
    const alert =
      lowStockAlert === "" ? null : parseInt(lowStockAlert, 10);

    if (isNaN(cp) || cp <= 0) e.costPrice = "Cost price must be > 0.";
    if (isNaN(sp) || sp <= 0) e.sellingPrice = "Selling price must be > 0.";
    if (!isNaN(cp) && !isNaN(sp) && sp < cp) {
      e.sellingPrice = "Selling price should be >= cost price.";
    }

    if (isNaN(st) || st < 0) e.stock = "Stock must be 0 or more.";

    if (alert !== null && (isNaN(alert) || alert < 0)) {
      e.lowStockAlert = "Low stock alert must be 0 or more.";
    }

    return e;
  };

  // ================= FILTER PRODUCTS =================
  const filtered = useMemo(() => {
    let list = [...products];

    // CATEGORY FILTER
    if (filterCategoryId !== "all") {
      const cid = Number(filterCategoryId);
      list = list.filter((p) => p.categoryId === cid);
    }

    // LOW STOCK FILTER: when sortOption = "lowStock", show ONLY low-stock
    if (sortOption === "lowStock") {
      list = list.filter((p) => {
        const s = p.stock ?? 0;
        const alert = p.lowStockAlert ?? 0;
        return alert > 0 && s <= alert;
      });
    }

    // SEARCH
    if (searchTerm.trim()) {
      const k = searchTerm.toLowerCase();
      list = list.filter((p) =>
        (p.name || "").toLowerCase().includes(k)
      );
    }

    // SORTING
    list.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "highStock":
          return (b.stock || 0) - (a.stock || 0);
        case "lowStock":
          // already filtered low-stock; sort by ascending stock
          return (a.stock || 0) - (b.stock || 0);
        default:
          return 0;
      }
    });

    return list;
  }, [products, searchTerm, sortOption, filterCategoryId]);

  // ================= SUBMIT =================
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setApiError("");
    setApiSuccess("");

    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const payload = {
      name: name.trim(),
      categoryId: Number(categoryId),
      costPrice: parseFloat(costPrice),
      sellingPrice: parseFloat(sellingPrice),
      stock: parseInt(stock || "0", 10),
      lowStockAlert:
        lowStockAlert === ""
          ? 0
          : Math.max(0, parseInt(lowStockAlert || "0", 10)),
      description: description.trim() || null,
      barcode: barcode.trim() || null,
    };

    try {
      if (editId) {
        await updateProduct(editId, payload);
        setApiSuccess("Product updated successfully.");
        showToast("Product updated successfully.", "success");
      } else {
        await addProduct(payload);
        setApiSuccess("Product added successfully.");
        showToast("Product added successfully.", "success");
      }

      resetForm();
      setTimeout(() => setApiSuccess(""), 3000);
    } catch (err) {
      console.error("Add/Update product failed:", err);
      const msg =
        err?.response?.data?.message ||
        "Failed to save product. Try again.";
      setApiError(msg);
      showToast(msg, "error");
      setTimeout(() => setApiError(""), 3000);
    }
  };

  // ================= EDIT =================
  const handleEdit = (product) => {
    setEditId(product.id);
    setName(product.name || "");
    setCategoryId(
      product.categoryId !== undefined && product.categoryId !== null
        ? String(product.categoryId)
        : ""
    );
    setCostPrice(
      product.costPrice !== null && product.costPrice !== undefined
        ? String(product.costPrice)
        : ""
    );
    setSellingPrice(
      product.sellingPrice !== null &&
      product.sellingPrice !== undefined
        ? String(product.sellingPrice)
        : ""
    );
    setStock(
      product.stock !== null && product.stock !== undefined
        ? String(product.stock)
        : ""
    );
    setLowStockAlert(
      product.lowStockAlert !== null &&
      product.lowStockAlert !== undefined
        ? String(product.lowStockAlert)
        : ""
    );
    setDescription(product.description || "");
    setBarcode(product.barcode || "");
    setErrors({});
    setApiError("");
    setApiSuccess("");
  };

  // ================= DELETE =================
  const handleDeleteClick = (product) => {
    setDeleteTarget({ id: product.id, name: product.name });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id);
      showToast("Product deleted successfully.", "success");
    } catch (err) {
      console.error("Delete product failed:", err);
      showToast("Failed to delete product.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  // ================= RESET FORM =================
  const resetForm = () => {
    setEditId(null);
    setName("");
    setCategoryId("");
    setCostPrice("");
    setSellingPrice("");
    setStock("");
    setLowStockAlert("");
    setDescription("");
    setBarcode("");
    setErrors({});
    setApiError("");
    setApiSuccess("");
  };

  // ===== RANDOM COLOR PALETTE FOR PRODUCT CARDS (stable per id) =====
  const getRandomColor = (id) => {
    const colors = [
      "#A5D6A7",
      "#81C784",
      "#4DB6AC",
      "#4FC3F7",
      "#64B5F6",
      "#9575CD",
      "#BA68C8",
      "#f899c7",
      "#f09d84",
      "#FFCC80",
      "#DCE775",
      "#AED581",
    ];
    return colors[Math.abs(id) % colors.length];
  };

  // ================= RENDER =================
  return (
    <>
      <div className="poppins text-gray-900 h-[85vh] flex flex-col">
        <h1 className="text-3xl font-bold mb-4 tracking-tight">
          Manage Products
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* ========== FORM CARD ========== */}
          <div className="bg-white rounded-xl shadow-xl border border-green-200 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FaBox className="text-green-600" />
                  {editId ? "Edit Product" : "Add Product"}
                </h2>
                {editId && (
                  <p className="text-xs text-gray-500">
                    Editing existing product (ID: {editId})
                  </p>
                )}
              </div>
              <button
                onClick={resetForm}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Reset
              </button>
            </div>

            {/* API MESSAGES */}
            {apiError && (
              <div className="mb-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {apiError}
              </div>
            )}
            {apiSuccess && (
              <div className="mb-3 text-xs text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                {apiSuccess}
              </div>
            )}

            <form className="space-y-4 flex-1" onSubmit={handleSubmit}>
              {/* NAME */}
              <div>
                <label className="text-sm font-medium">Product Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Coca Cola"
                  className={`mt-2 w-full px-3 py-2 rounded-md outline-none border text-sm
                    ${
                      errors.name ? "border-red-400" : "border-green-200"
                    } focus:ring-2 focus:ring-green-500`}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              {/* CATEGORY */}
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={`mt-2 w-full px-3 py-2 rounded-md outline-none border text-sm
                    ${
                      errors.categoryId
                        ? "border-red-400"
                        : "border-green-200"
                    } focus:ring-2 focus:ring-green-500`}
                >
                  <option value="">Select category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.categoryId}
                  </p>
                )}
              </div>

              {/* PRICE ROW */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Cost Price</label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    placeholder="0"
                    className={`mt-2 w-full px-3 py-2 rounded-md outline-none border text-sm
                      ${
                        errors.costPrice
                          ? "border-red-400"
                          : "border-green-200"
                      } focus:ring-2 focus:ring-green-500`}
                  />
                  {errors.costPrice && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.costPrice}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Selling Price</label>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="0"
                    className={`mt-2 w-full px-3 py-2 rounded-md outline-none border text-sm
                      ${
                        errors.sellingPrice
                          ? "border-red-400"
                          : "border-green-200"
                      } focus:ring-2 focus:ring-green-500`}
                  />
                  {errors.sellingPrice && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.sellingPrice}
                    </p>
                  )}
                </div>
              </div>

              {/* STOCK ROW */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                    className={`mt-2 w-full px-3 py-2 rounded-md outline-none border text-sm
                      ${
                        errors.stock ? "border-red-400" : "border-green-200"
                      } focus:ring-2 focus:ring-green-500`}
                  />
                  {errors.stock && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.stock}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Low Stock Alert
                  </label>
                  <input
                    type="number"
                    value={lowStockAlert}
                    onChange={(e) => setLowStockAlert(e.target.value)}
                    placeholder="e.g. 5"
                    className={`mt-2 w-full px-3 py-2 rounded-md outline-none border text-sm
                      ${
                        errors.lowStockAlert
                          ? "border-red-400"
                          : "border-green-200"
                      } focus:ring-2 focus:ring-green-500`}
                  />
                  {errors.lowStockAlert && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.lowStockAlert}
                    </p>
                  )}
                </div>
              </div>

              {/* BARCODE — only visible when editing */}
              {editId && (
                <div>
                  <label className="text-sm font-medium">Barcode</label>
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Barcode"
                    className="mt-2 w-full px-3 py-2 rounded-md border border-green-200 outline-none text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}

              {/* DESCRIPTION */}
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  className="mt-2 w-full px-3 py-2 rounded-md border border-green-200 outline-none h-20 resize-none text-sm focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full py-2 rounded-md text-white font-semibold bg-green-600 hover:bg-green-700 transition"
              >
                {editId ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>

          {/* ========== PRODUCT LIST CARD ========== */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-xl border border-green-200 p-6 flex flex-col">
            {/* TOP BAR */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaBox className="text-green-600" /> Your Products
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={filterCategoryId}
                  onChange={(e) => setFilterCategoryId(e.target.value)}
                  className="px-3 py-2 border border-green-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-3 py-2 border border-green-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highStock">Highest Stock</option>
                  <option value="lowStock">Low Stock Only</option>
                </select>
              </div>

              <div className="relative max-w-xs w-full">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-3 py-2 rounded-md border border-green-200 outline-none text-sm focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* LIST */}
            <div className="h-[500px] overflow-y-auto pr-1">
              {loading && (
                <p className="text-gray-500 text-sm">Loading products...</p>
              )}

              {!loading && filtered.length === 0 && (
                <p className="text-gray-500 text-sm">No products found.</p>
              )}

              {!loading && filtered.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5 pb-4">
                  {filtered.map((product) => {
                    const profit =
                      (product.profitPerUnit ??
                        product.sellingPrice - product.costPrice) || 0;
                    const totalStockValue =
                      profit * (product.stock || 0);
                    const lowStock =
                      product.stock !== null &&
                      product.lowStockAlert !== null &&
                      product.stock <= product.lowStockAlert;

                    return (
                      <div
                        key={product.id}
                        style={{
                          backgroundColor: getRandomColor(product.id),
                        }}
                        className="p-5 rounded-xl shadow border border-green-200 bg-white flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {product.name}
                              </h3>
                              {product.sku && (
                                <p className="text-xs text-gray-900">
                                  SKU: {product.sku}
                                </p>
                              )}
                              {product.barcode && (
                                <p className="text-xs text-gray-900">
                                  Barcode: {product.barcode}
                                </p>
                              )}
                            </div>
                            {product.categoryName && (
                              <span className="px-2 py-1 rounded-full text-xs whitespace-nowrap bg-green-50 text-green-700 border border-green-200">
                                {product.categoryName}
                              </span>
                            )}
                          </div>

                          {product.description && (
                            <p className="mt-2 text-xs text-gray-900 line-clamp-2">
                              {product.description}
                            </p>
                          )}

                          <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-gray-50 rounded-lg px-3 py-2">
                              <p className="text-gray-500">Cost</p>
                              <p className="font-semibold text-gray-800">
                                ₹{product.costPrice}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg px-3 py-2">
                              <p className="text-gray-500">Selling</p>
                              <p className="font-semibold text-gray-800">
                                ₹{product.sellingPrice}
                              </p>
                            </div>
                            <div className="bg-green-50 rounded-lg px-3 py-2">
                              <p className="text-gray-500">
                                Profit / Unit
                              </p>
                              <p className="font-semibold text-green-700">
                                ₹{profit.toFixed(2)}
                              </p>
                            </div>
                            <div className="bg-green-50 rounded-lg px-3 py-2">
                              <p className="text-gray-500">
                                Total Profit (stock)
                              </p>
                              <p className="font-semibold text-green-700">
                                ₹{totalStockValue.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded-full border ${
                                  lowStock
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-green-50 text-green-700 border-green-200"
                                }`}
                              >
                                Stock: {product.stock}
                              </span>
                              <span className="px-2 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200">
                                Alert at: {product.lowStockAlert}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <button
                            onClick={() => handleEdit(product)}
                            className="px-3 py-1 text-xs rounded-full bg-white/90 hover:bg-white text-gray-800 font-medium border border-gray-200"
                          >
                            <FaEdit className="inline-block mr-1" /> Edit
                          </button>

                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="px-3 py-1 text-xs rounded-full bg-red-500 hover:bg-red-600 text-white font-medium"
                          >
                            <FaTrash className="inline-block mr-1" /> Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM DELETE POPUP */}
      <ConfirmDelete
        open={!!deleteTarget}
        name={deleteTarget?.name}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* TOAST */}
      <Toast
        message={toastMsg}
        type={toastType}
        onClose={() => setToastMsg("")}
      />
    </>
  );
}
