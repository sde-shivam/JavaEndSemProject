import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AdminRoute() {
  const { user, loading } = useContext(AuthContext);

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

  if (!user) return <Navigate to="/login" replace />;

  // If NOT admin → deny access
  if (user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
