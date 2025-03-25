import React from 'react'
import { FaBell } from "react-icons/fa6";
import { Link } from 'react-router-dom'
import {jwtDecode} from "jwt-decode";
import { IoDiamond } from "react-icons/io5";


const extractInitials = () => {
  const token=localStorage.getItem("authToken")
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return; // Important to prevent further execution
  }

// Helper function to check token expiry
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

 if(!token) return null;
 try{
  const decoded = jwtDecode(token);
  const email = decoded.email || "";

  // Extract initials (first letter of first and last part before "@")
  const nameParts = email.split("@")[0].split(".");
  const initials = nameParts.map(part => part[0].toUpperCase()).join("");

  return initials;
 } catch (error) {
  console.error("Error decoding token:", error);
  return null;
}
};

function Navbar() {
  

const initials =extractInitials();

  return (
    <nav className='flex justify-around items-center p-5  bg-[#CAD5E2] text-black sticky top-0'>
      <h1 className='font-bold text-3xl'><Link to="/">Beautify </Link></h1>
      <ul className='flex justify-end items-center gap-4 '>
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
          {initials?(<Link className='bg-[#000000] text-white p-3 font-bold rounded-full' to="/profile">{initials}</Link>):(<li className=' border border-white font-bold text-white py-3 px-3 bg-black rounded-full'>
          <Link to="/login" >
          Log In
          </Link>
          </li>)}
        
      </ul>
    </nav>
  )
}

export default Navbar