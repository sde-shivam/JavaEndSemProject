import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <div
          aria-label="Orange and tan hamster running in a metal wheel"
          role="img"
          className="wheel-and-hamster"
        >
          <div className="wheel"></div>
          <div className="hamster">
            <div className="hamster__body">
              <div className="hamster__head">
                <div className="hamster__ear"></div>
                <div className="hamster__eye"></div>
                <div className="hamster__nose"></div>
              </div>
              <div className="hamster__limb hamster__limb--fr"></div>
              <div className="hamster__limb hamster__limb--fl"></div>
              <div className="hamster__limb hamster__limb--br"></div>
              <div className="hamster__limb hamster__limb--bl"></div>
              <div className="hamster__tail"></div>
            </div>
          </div>
          <div className="spoke"></div>
        </div>
      </div>
    );
  }

  // Validation
  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required.";
    if (!password.trim()) e.password = "Password is required.";
    return e;
  };

  // Submit
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setApiError("");

    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    try {
      setLoading(true);

      const payload = {
        email,
        password,
      };

      // LOGIN HANDLES REDIRECT INTERNALLY
      await login(payload);
    } catch (err) {
      console.error("Login failed:", err);

      if (err?.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef0f2] px-6 poppins">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Login to your Quick Bills account.
        </p>

        {apiError && <p className="text-red-600 text-sm mb-4">{apiError}</p>}

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="mb-5">
            <label className="text-sm font-medium text-gray-800">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
              value={password}
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
            className={`w-full py-2 rounded-md font-medium text-white transition 
              ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{" "}
          <Link to={"/signup"}>
            <span className="text-green-600 hover:underline cursor-pointer">
              Create one
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
