import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { FaUser, FaEnvelope, FaLock, FaUserShield, FaUsers } from "react-icons/fa";

export default function CreateUserPage() {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    shopName: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
  });

  // ---------------- VALIDATE ----------------
  const validate = () => {
    const e = {};

    if (!form.shopName.trim()) e.shopName = "Shop name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    if (!form.password.trim()) e.password = "Password is required.";
    return e;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setErrors({});
    setSuccess("");

    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    try {
      await api.post("/user/create", form);

      setSuccess("User created successfully.");

      setForm({
        shopName: "",
        email: "",
        password: "",
        role: "USER",
      });

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setErrors({
        api: err?.response?.data?.message || "Failed to create user.",
      });
    }
  };

  // ---------------- BLOCK NON ADMIN ----------------
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="text-center mt-16 text-red-600 font-bold text-xl">
        Access Denied (ADMIN ONLY)
      </div>
    );
  }

  return (
    <div className="poppins flex justify-center mt-5">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl border border-green-200 p-10">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <FaUserShield className="text-4xl text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Create New User</h1>
        </div>

        {/* ERROR */}
        {errors.api && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
            {errors.api}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* SHOP NAME */}
          <div>
            <label className="text-sm font-medium">Shop Name</label>
            <div className="relative mt-2">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={form.shopName}
                onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                placeholder="Enter shop name"
                className={`w-full pl-10 pr-3 py-2 rounded-lg border outline-none text-sm
              ${errors.shopName ? "border-red-400" : "border-green-300"}
              focus:ring-2 focus:ring-green-500`}
              />
            </div>
            {errors.shopName && (
              <p className="text-xs text-red-500 mt-1">{errors.shopName}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="relative mt-2">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter email address"
                className={`w-full pl-10 pr-3 py-2 rounded-lg border outline-none text-sm
              ${errors.email ? "border-red-400" : "border-green-300"}
              focus:ring-2 focus:ring-green-500`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative mt-2">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter password"
                className={`w-full pl-10 pr-3 py-2 rounded-lg border outline-none text-sm
              ${errors.password ? "border-red-400" : "border-green-300"}
              focus:ring-2 focus:ring-green-500`}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* ROLE SELECT — TWO BIG BUTTON BOXES */}
          <div>
            <label className="text-sm font-medium">Select Role</label>

            <div className="grid grid-cols-2 gap-4 mt-3">

              {/* USER */}
              <div
                onClick={() => setForm({ ...form, role: "USER" })}
                className={`cursor-pointer p-5 rounded-xl border-2 flex flex-col items-center transition shadow-sm 
                  ${
                    form.role === "USER"
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
              >
                <FaUsers className="text-2xl mb-2 text-gray-700" />
                <p className="font-semibold text-gray-900">User</p>
              </div>

              {/* ADMIN */}
              <div
                onClick={() => setForm({ ...form, role: "ADMIN" })}
                className={`cursor-pointer p-5 rounded-xl border-2 flex flex-col items-center transition shadow-sm
                  ${
                    form.role === "ADMIN"
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
              >
                <FaUserShield className="text-2xl mb-2 text-gray-700" />
                <p className="font-semibold text-gray-900">Admin</p>
              </div>

            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full mt-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}
