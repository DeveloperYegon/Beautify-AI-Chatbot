import React,{useEffect,useState} from 'react'
import { FaBell } from "react-icons/fa6";
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import { IoDiamond } from "react-icons/io5";


// Helper function to check token expiry
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}



function Navbar() {
  const [initials, setInitials] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("authToken");
      navigate("/login"); // Use React Router for navigation
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const email = decoded.email || "";
      const nameParts = email.split("@")[0].split(".");
      const userInitials = nameParts.map((part) => part[0].toUpperCase()).join("");
      setInitials(userInitials);
    } catch (error) {
      console.error("Error decoding token:", error);
      setInitials(null);
    }
  }, []);

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
          Login
          </Link>
          </li>)}
        
      </ul>
    </nav>
  )
}

export default Navbar