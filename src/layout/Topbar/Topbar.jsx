import React from 'react'
import "./Topbar.css";
import logo from "../../assets/logo.svg"
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/user";
import { Navigate, useNavigate } from "react-router-dom/dist";
export default function Topbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const storeUser = useSelector((state) => state.user.value);
    const signout = () => {
        navigate("/login", {
          replace: true,
          state: { storeuser:storeUser.user},
        });
        dispatch(logout());
      };
      
  return (
    <div className="header">
              <nav>
                <ul className="  SidebarList">
                <li>
                    <NavLink
                      id="title"
                     // to="/Statistique"
                      className={({ isActive }) =>
                        isActive ? "active" : "not-active-class"
                      }
                    >
                
                     <img src={logo} alt="Shyrine prod"  className='logo'/>
                    </NavLink>
                  </li>
                 <li>
                    <NavLink
                      id="creations"
                      to="/Conge"
                      className={({ isActive }) =>
                        isActive ? "active" : "not-active-class"
                      }
                    >
                   <i class="fa-solid fa-calendar-days"></i> Creé un congé
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      id="creations"
                      to="/Conge"
                      className={({ isActive }) =>
                        isActive ? "active" : "not-active-class"
                      }
                    >
                   <i class="fa-solid fa-calendar-days"></i> Creé une  autoriation
                    </NavLink>
                  </li>
                  <li>
                    <div className="dropdown">
                      <a
                        className="dropdown-toggle"
                        href="#"
                        id="title"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                       <span className="icon me-2"><i className="fa-solid fa-user"></i></span>
                        {
                          storeUser.user.name
                        }    <sup>{
                          storeUser.user.role
                        }</sup> 
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a
                            className="dropdown-item"
                            id="title"
                            href="#"
                            onClick={(e) => {
                              signout();
                            }}
                          >
                            <i className="fal fa-sign-out-alt"></i> Déconnect
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
             
                </ul>
              </nav>
            
    </div>
  )
}
