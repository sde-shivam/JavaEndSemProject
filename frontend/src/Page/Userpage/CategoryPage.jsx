import React, { useState, useContext, useMemo } from "react";
import { CategoryContext } from "../../context/CategoryContext";
import { FaSearch, FaTrash, FaEdit, FaTag } from "react-icons/fa";

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
          Delete Category
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

export default function CategoryPage() {
  const {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useContext(CategoryContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [bgColor, setBgColor] = useState("#5B8DEF");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);

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

  // RANDOM COLOR
  const generateColor = () => {
    const palette = [
      "#4CAF50",
      "#66BB6A",
      "#29B6F6",
      "#42A5F5",
      "#7E57C2",
      "#FFA726",
      "#FF7043",
      "#26A69A",
    ];
    const color = palette[Math.floor(Math.random() * palette.length)];
    setBgColor(color);
    return color;
  };

  // VALIDATION
  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Category name is required.";
    if (!bgColor.trim()) e.bgColor = "Color cannot be empty.";
    return e;
  };

  // FILTERED LIST
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return categories || [];
    return (categories || []).filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // SUBMIT
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setApiError("");

    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const payload = { name, description, bgColor };

    try {
      if (editId) {
        await updateCategory(editId, payload);
        showToast("Category updated successfully.", "success");
      } else {
        await createCategory(payload);
        showToast("Category created successfully.", "success");
      }
      resetForm();
    } catch (err) {
      const message =
        err?.response?.data?.message || "Something went wrong";
      setApiError(message);
      showToast(message, "error");

      // Optional auto-hide for inline error
      setTimeout(() => setApiError(""), 3000);
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setName(cat.name || "");
    setDescription(cat.description || "");
    setBgColor(cat.bgColor || generateColor());
    setErrors({});
    setApiError("");
  };

  const handleDeleteCategory = (cat) => {
    // open confirm popup
    setDeleteTarget({ id: cat.id, name: cat.name });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id);
      showToast("Category deleted successfully.", "success");
    } catch (err) {
      showToast("Failed to delete category.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setName("");
    setDescription("");
    generateColor();
    setErrors({});
    setApiError("");
  };

  return (
    <>
      <div className="poppins text-gray-900 h-[85vh] flex flex-col">
        <h1 className="text-3xl font-bold mb-4 tracking-tight">
          Manage Categories
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 mt-3">
          {/* ==================== FORM BOX ==================== */}
          <div className="bg-white rounded-xl shadow-xl border border-green-200 p-6 flex flex-col h-full">
            {/* API ERROR */}
            {apiError && (
              <p className="text-red-600 text-sm bg-red-100 border border-red-300 px-3 py-2 rounded mb-3">
                {apiError}
              </p>
            )}

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editId ? "Edit Category" : "Create Category"}
              </h2>
              <button
                onClick={resetForm}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Reset
              </button>
            </div>

            <form className="space-y-4 flex-1" onSubmit={handleSubmit}>
              {/* NAME */}
              <div>
                <label className="text-sm font-medium">Category Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Beverages"
                  className={`mt-2 w-full px-3 py-2 rounded-md outline-none
                    focus:ring-2 focus:ring-green-500
                    ${
                      errors.name
                        ? "border border-red-400"
                        : "border border-green-200"
                    }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  className="mt-2 w-full px-3 py-2 rounded-md border border-green-200 h-24 resize-none outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* COLOR PICKER */}
              <div>
                <label className="text-sm font-medium flex justify-between">
                  Card Color
                  <button
                    type="button"
                    onClick={generateColor}
                    className="text-xs text-green-600 hover:underline"
                  >
                    Random color
                  </button>
                </label>

                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    placeholder="#5B8DEF"
                    className={`px-3 py-2 flex-1 rounded-md outline-none
                      focus:ring-2 focus:ring-green-500
                      ${
                        errors.bgColor
                          ? "border border-red-400"
                          : "border border-green-200"
                      }`}
                  />
                  <div
                    className="w-10 h-10 rounded-lg border border-green-300"
                    style={{ backgroundColor: bgColor }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-md text-white font-semibold 
                bg-green-600 hover:bg-green-700 transition"
              >
                {editId ? "Update Category" : "Create Category"}
              </button>
            </form>
          </div>

          {/* ==================== CATEGORY LIST BOX ==================== */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-xl border border-green-200 p-6 flex flex-col h-full">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaTag className="text-green-600" /> Your Categories
              </h2>

              <div className="relative max-w-xs w-full">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full pl-10 pr-3 py-2 rounded-md border border-green-200 outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* LIST SCROLL AREA */}
            <div className="flex-1 overflow-y-auto pr-1">
              {loading && (
                <p className="text-gray-500 text-sm">Loading categories...</p>
              )}

              {!loading && filtered.length === 0 ? (
                <p className="text-gray-500 text-sm">No categories found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-4">
                  {filtered.map((cat) => (
                    <div
                      key={cat.id}
                      className="p-5 rounded-xl shadow border border-green-200 flex flex-col justify-between"
                      style={{ backgroundColor: cat.bgColor }}
                    >
                      <h3 className="font-semibold text-white text-lg drop-shadow">
                        {cat.name}
                      </h3>

                      <div className="mt-5 flex items-center justify-between">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="px-3 py-1 text-xs rounded-full bg-white/90 hover:bg-white text-gray-800 font-medium"
                        >
                          <FaEdit className="inline-block mr-1" /> Edit
                        </button>

                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="px-3 py-1 text-xs rounded-full bg-red-500 hover:bg-red-600 text-white font-medium"
                        >
                          <FaTrash className="inline-block mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
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
