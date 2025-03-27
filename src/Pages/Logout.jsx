import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import {  useDispatch } from "react-redux";
import { logout } from "../redux/authSlice"; // Import action
import 'react-toastify/dist/ReactToastify.css';

const LogoutButton = () => {
    const dispatch = useDispatch();
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();
    
    const notifySuccess = () => toast.success("Logged Out Successfully!");

    const handleLogout = () => {
       dispatch(logout());
        notifySuccess();
        
        // Delay navigation slightly to allow the toast message to display
        setTimeout(() => {
            navigate('/login');
        }, 1500);
    };

    return (
        <main className=" flex justify-center h-[50vh] border rounded-2xl m-3 items-center">
            <button className="bg-[#F13934] rounded-md p-2 hover:bg-red-700 font-bold text-black transition duration-300" onClick={handleLogout}>
                Logout
            </button>
            
            <ToastContainer
                autoClose={3000}
                position="top-center"
                hideProgressBar={false}
                closeOnClick
                draggable
                pauseOnHover
            />
        </main>
    );
};

export default LogoutButton;
