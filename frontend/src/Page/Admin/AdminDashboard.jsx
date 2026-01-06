import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaTrash,
} from "react-icons/fa";

const API = `${import.meta.env.VITE_API_BASE_URL}/admin/users`;

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL"); // NEW FILTER STATE

  const api = useMemo(
    () =>
      axios.create({
        baseURL: API,
        withCredentials: true,
      }),
    []
  );

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Activate or Deactivate User
  const toggleUserStatus = async (id, active) => {
    try {
      await api.put(`/${id}/${active ? "deactivate" : "activate"}`);
      fetchUsers();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  // Delete User
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.active).length;
  const inactiveUsers = users.filter((u) => !u.active).length;

  // FILTERED LIST
  const filteredUsers = useMemo(() => {
    if (filter === "ACTIVE") return users.filter((u) => u.active);
    if (filter === "INACTIVE") return users.filter((u) => !u.active);
    return users; // ALL
  }, [users, filter]);

  return (
    <div className="poppins text-gray-900 p-5">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        {/* Total Users */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200 flex items-center gap-4">
          <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center">
            <FaUsers className="text-green-600 text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-3xl font-bold">{totalUsers}</p>
          </div>
        </div>

        {/* Active */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200 flex items-center gap-4">
          <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center">
            <FaUserCheck className="text-green-600 text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-3xl font-bold">{activeUsers}</p>
          </div>
        </div>

        {/* Inactive */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200 flex items-center gap-4">
          <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center">
            <FaUserTimes className="text-red-500 text-2xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Inactive Users</p>
            <p className="text-3xl font-bold">{inactiveUsers}</p>
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 rounded-lg text-sm font-medium border 
            ${
              filter === "ALL"
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
        >
          All Users
        </button>

        <button
          onClick={() => setFilter("ACTIVE")}
          className={`px-4 py-2 rounded-lg text-sm font-medium border 
            ${
              filter === "ACTIVE"
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
        >
          Active Users
        </button>

        <button
          onClick={() => setFilter("INACTIVE")}
          className={`px-4 py-2 rounded-lg text-sm font-medium border 
            ${
              filter === "INACTIVE"
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
        >
          Inactive Users
        </button>
      </div>

      {/* USER TABLE */}
      <div className="mt-6 bg-white p-6 rounded-xl shadow border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">All Users</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Shop Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-gray-200">
                  <td className="px-4 py-3">{u.id}</td>
                  <td className="px-4 py-3">{u.shopname}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        u.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {u.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <button
                      onClick={() => toggleUserStatus(u.id, u.active)}
                      className={`px-3 py-1 rounded-md text-white text-xs font-medium ${
                        u.active
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {u.active ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => deleteUser(u.id)}
                      className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
