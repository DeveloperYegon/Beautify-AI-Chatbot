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
      <h1 className='font-bold text-3xl'><Link to="/">Beautify AI </Link></h1>

      <ul className="flex items-center gap-4">
      <li>
          <Link to="/notifications">
          <FaBell className='text-3xl' /> 
          </Link>
          </li>
          <Link to="/premium-subscription">
          <li className="flex items-center border font-bold rounded-full hover:bg-[#F0BA30] p-2  gap-2">
          <IoDiamond className='text-3xl  text-[#000]' />
          <span>Go Premium</span> 
          </li>
            </Link>
        {isAuthenticated ? (
          <>
            <button onClick={handleLogout} className="border border-white text-black py-3 px-3 bg-[#F0BA30] font-bold rounded-full">
              Logout
            </button>
            <li className="bg-[#000000] border-white text-white p-3 font-bold rounded-full">
              <Link to="/profile">{user?.email?.charAt(0).toUpperCase()}</Link>
            </li>
          </>
        ) : (
          <li className="border border-black text-black py-3 px-3 hover:bg-[#F0BA30] font-bold rounded-full">
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navbar