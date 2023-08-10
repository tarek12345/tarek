import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom/dist";
import { isExpired, decodeToken } from "react-jwt";
import { useSelector } from "react-redux";
import Cookies from "universal-cookie";
export default function ProtectedRoutes({ children }) {
  const state = useSelector((stat) => stat.user.value);
  let location = useLocation();
  if (Object.keys(state).length === 0) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else {
    return children;
  }
}
