import React, { useEffect, useState } from 'react';
import Modal from '../Pages/Modal';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import {  updateUser } from "../redux/userSlice";
import { jwtDecode } from "jwt-decode";

function Premium() {
  const dispatch = useDispatch();
  const { data: user, isLoading } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  // Extract user ID from JWT token
  const token = localStorage.getItem('authToken');
  if (!token) {
    navigate("/login");
  }
  
  let userId = null;
  try {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.userId;
  } catch (error) {
    console.error("Error decoding token:", error);
    navigate("/login"); // Redirect if token is invalid
  }

  useEffect(() => {
    if (user) {
      reset(user); // Populate form with user data
    }
  }, [user, reset]);

  // Open/Close Modal
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // Handle form submission
  const handleSave = async (data) => {
    if (!data.terms) {
      toast.error("You must agree to the terms to subscribe.");
      return;
    }

    try {
      const updatedProfile = {
        ...user,
        userId,
        isPremium: true,
        subscriptionAmount: 1000,
        subscriptionStatus: "active",
        subscriptionDate: new Date().toISOString().split("T")[0], // Current date in yyyy-MM-dd format
          subscriptionExpiry: (() => {
         const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Add 1 year
        return expiryDate.toISOString().split("T")[0]; // Extract yyyy-MM-dd
        })(),
        termsAccepted: true
      };

      dispatch(updateUser(updatedProfile));
      toast.success("Premium subscription successful!");
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error("Error updating profile. Please try again.");
      console.error("Update Error:", error);
    }
  };

  return (
    <main className='h-full pt-5 pb-11 rounded-[10px] bg-white'>
      <div className='border md:w-1/2 rounded-[10px] m-3 md:m-auto p-5 border-slate-500'>
        <h1 className='text-3xl font-bold py-3 text-center'>Annual Premium Subscription</h1>
        <hr className='w-[50%] h-1 m-auto bg-black' />
        <p className='text-center py-3'>Subscribe to our premium plan to access exclusive features.</p>

        <ul className='text-center'>
          <li className='border border-amber-300 m-2 font-bold rounded-full p-2'>Get 20% discounts on product shopping every month.</li>
          <li className='border border-amber-300 m-2 font-bold rounded-full p-2'>Free Dermatology check-ups and advice annually.</li>
          <li className='border border-amber-300 m-2 font-bold rounded-full p-2'>Email and push notifications with personalized beauty tips.</li>
          <li className='border border-amber-300 m-2 font-bold rounded-full p-2'>50% discount on VIP tickets for product launch events.</li>
        </ul>

        <div onClick={openModal} className='flex justify-center gap-4 mt-5'>
          <button className='bg-[#F0BA30] p-3 px-5 rounded-full font-bold'>Subscribe @ $1000</button>
        </div>

        {/* Subscription Modal */}
        <Modal show={showModal} onClose={closeModal}>
          <section className="p-10 w-[80%] h-[80vh] m-auto">
            <h2 className="text-xl text-center py-4 font-semibold text-[#000]">Annual Premium Subscription</h2>
            <hr className='w-[50%] h-1 m-auto bg-black' />

            <form noValidate onSubmit={handleSubmit(handleSave)} className="flex flex-col">
              <label className='py-3 font-bold' htmlFor="amount">Amount:</label>
              <input 
                type="number" 
                value="1000" 
                className="border rounded-full px-4 py-3" 
                disabled
              />

              <div className='flex flex-row my-7'>         
                <input 
                  type="checkbox" 
                  {...register("terms", { required: "You must agree to Terms" })}
                  className="mx-3"
                />
                <label htmlFor="terms" className="text-sm text-gray-500">I Acknowledge to Go Premium</label>
              </div>
              {errors.terms && <span className="text-red-600 text-sm">{errors.terms.message}</span>}

              <button type="submit" className="px-3 my-3 py-3 rounded-full bg-[#F0BA30] font-bold text-black">
                Proceed to Checkout
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-5">*You can unsubscribe anytime</p>
          </section>
        </Modal>

        <p className='text-center italic my-4'>*Unsubscribe Anytime*</p>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </main>
  );
}

export default Premium;
