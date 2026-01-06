import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function SignupPage() {
  const [shopname, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const { signup, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // =============================================================
  // VALIDATION
  // =============================================================
  const validate = () => {
    const e = {};

    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~]).{8,}$/;

    // SHOP NAME
    if (!shopname.trim()) {
      e.shopName = "Shop name is required.";
    } else if (shopname.length < 6) {
      e.shopName = "Shop name must be at least 6 characters.";
    } else if (!/^[A-Za-z0-9\s]+$/.test(shopname)) {
      e.shopName = "Shop name can only contain letters, numbers, and spaces.";
    }

    // EMAIL
    if (!email.trim()) e.email = "Email is required.";
    else if (!emailPattern.test(email)) e.email = "Enter a valid email.";

    // PASSWORD
    if (!pass.trim()) e.password = "Password is required.";
    else if (!passwordPattern.test(pass)) {
      e.password =
        "Password must be 8+ chars, with uppercase, lowercase, number & special char.";
    }

    return e;
  };

  // =============================================================
  // SUBMIT
  // =============================================================
  const handleSubmit = async (ev) => {
  ev.preventDefault();
  setApiError("");

  const e = validate();
  setErrors(e);

  if (Object.keys(e).length > 0) return;

  try {
    const payload = {
      shopname,
      email,
      password: pass,  // FIX
    };

    await signup(payload);

    setShopName("");
    setEmail("");
    setPassword("");

    navigate("/login");

  } catch (err) {
    if (err?.response?.data?.message) {
      setApiError(err.response.data.message);
    } else {
      setApiError("Signup failed. Try again.");
    }
  }
};


  // =============================================================
  // UI
  // =============================================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef0f2] px-6 poppins">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Create your account
        </h1>
        <p className="text-gray-500 text-sm mb-4">
          Start managing your sales with Quick Bills.
        </p>

        {/* API ERROR */}
        {apiError && <p className="text-red-600 text-sm mb-4">{apiError}</p>}

        <form onSubmit={handleSubmit}>

          {/* SHOP NAME */}
          <div className="mb-5">
            <label className="text-sm font-medium text-gray-800">
              Shop Name
            </label>
            <input
              type="text"
              value={shopname}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Enter your shop name"
              className={`mt-2 w-full px-3 py-2 border rounded-md outline-none 
                focus:ring-2 focus:ring-green-500
                ${errors.shopName ? "border-red-300" : "border-gray-300"}`}
            />
            {errors.shopName && (
              <p className="text-red-600 text-xs mt-1">{errors.shopName}</p>
            )}
          </div>

          {/* EMAIL */}
          <div className="mb-5">
            <label className="text-sm font-medium text-gray-800">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={`mt-2 w-full px-3 py-2 border rounded-md outline-none 
                focus:ring-2 focus:ring-green-500
                ${errors.email ? "border-red-300" : "border-gray-300"}`}
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-800">
              Password
            </label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={`mt-2 w-full px-3 py-2 border rounded-md outline-none 
                focus:ring-2 focus:ring-green-500
                ${errors.password ? "border-red-300" : "border-gray-300"}`}
            />
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-medium transition
              ${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>

        <Link to={"/login"}>
          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <span className="text-green-600 hover:underline cursor-pointer">
              Login
            </span>
          </p>
        </Link>
      </div>
    </div>
  );
}
