import React from 'react'
import { FaBell } from "react-icons/fa6";
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className='flex justify-between items-center p-5 bg-gray-800 text-white sticky top-0'>
      <h1 className='font-bold text-3xl'><Link to="/">Beautify </Link></h1>
      <ul className='flex items-center gap-4'>
        <li>
          <Link to="/notifications">
          <FaBell />
          </Link>
          </li>
        <li className=' border border-white font-bold text-white py-3 px-3  rounded-full'>
          <Link to="/signup" >
          Sign Up
          </Link>
          </li>
      </ul>
    </nav>
  )
}

export default Navbar