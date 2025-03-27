import React,{useEffect,useState} from 'react'
import { FaBell } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice"; // Import action
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { IoDiamond } from "react-icons/io5";


function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Get user data
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };


  return (
    <nav className='flex justify-around items-center p-5  bg-[#CAD5E2] text-black sticky top-0'>
      <h1 className='font-bold text-3xl'><Link to="/">Beautify </Link></h1>

      <ul className="flex items-center gap-4">
      <li>
          <Link to="/notifications">
          <FaBell className='text-3xl' />
          </Link>
          </li>
          <li>
          <Link to="/premium-subscription">
          <IoDiamond className='text-3xl text-[#F0BA30]' />
            </Link>
          </li>
        {isAuthenticated ? (
          <>
            <li className="bg-[#000000] text-white p-3 font-bold rounded-full">
              <Link to="/profile">{user?.email?.charAt(0).toUpperCase()}</Link>
            </li>
            <button onClick={handleLogout} className="border border-white text-white py-3 px-3 bg-red-500 font-bold rounded-full">
              Logout
            </button>
          </>
        ) : (
          <li className="border border-white text-white py-3 px-3 bg-black font-bold rounded-full">
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar