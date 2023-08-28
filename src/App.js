import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "./assets/fontawesome-pro-6.1.0-web/css/all.css";
import "./App.css";
import NotFound from "./pages/404/NotFound";
import Login from "./pages/auth/Login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoutes from "./pages/auth/AuthGard/ProtectedRoutes";
import axios from "axios";
import CryptoJS from "crypto-js";
import { login, logout, setToken } from "./redux/features/user";
import Cookies from "universal-cookie";

import { useEffect } from "react";
import Home from "./pages/home/home";
import CreateLogin from "./pages/auth/CreateLogin/CreateLogin";
import UpdatePawword from "./pages/auth/AuthGard/UpdatePawword/UpdatePawword";
import Conge from "./components/Conge/Conge";

function App() {
  const cookies = new Cookies();
  axios.defaults.withCredentials = true;
  const state = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  // Add a request interceptor
  axios.interceptors.request.use(async (config) => {
    config.headers["Authorization"] = cookies.get("authorization");
    config.headers["Refresh"] = cookies.get("refresh");

    return config;
  });

  // Add a response interceptor
  axios.interceptors.response.use(
    async function (response) {
      return response;
    },
    function (error) {
      if (
        typeof error.response.status != "undefined" &&
        error.response.status == 401
      ) {
        dispatch(logout());
        //window.location.href = "/login";
      } else {
        return Promise.reject(error);
      }
    }
  );
  const handleClearConsole = () => {
     //console.clear();
  };
  useEffect(() => {
    handleClearConsole();
  });
  return (
    <div className="App content-desk" id="app">
      <BrowserRouter>
        <Routes>
          <Route
            index
            path={"/"}
            element={
              <ProtectedRoutes>
                <Home />
              </ProtectedRoutes>
            }
          />
          <Route
            
            path={"/home"}
            element={
              <ProtectedRoutes>
                <Home />
              </ProtectedRoutes>
            }
          /> 
            <Route
            
            path={"/Conge"}
            element={
              <ProtectedRoutes>
                <Conge/>
              </ProtectedRoutes>
            }
          />
          <Route  path="/login" element={<Login />} />
          <Route path="/CreateLogin" element={<CreateLogin />} />
          <Route path="/UpdatePawword" element={<UpdatePawword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
