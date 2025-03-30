import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function ResetPassword() {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const [errorMessages, setErrorMessages] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Toast notification for success 
  const notifySuccess = () => toast("Password reset successfully!");

  // Submit handler
  const onSubmit = async (data) => {
    setIsLoading(true); // Show loading indicator
    
    try {
      // Send PUT request to backend (Ensure your backend supports PUT)
      const response = await axios.post("http://localhost:5001/api/users/forgot-password", {
        email: data.email,
        password: data.password
      });
  
      if (response.status === 200) {
        notifySuccess(); 
        reset(); // 
        setErrorMessages(''); 
        setTimeout(() => {
          navigate('/login'); 
        }, 2000);
      } else {
        setErrorMessages(response.data.message || "Something went wrong");
        console.log(response.data.message);
      }
    } catch (err) {
      console.log(err);
      setErrorMessages(err.response?.data?.message || "Failed to reset password"); 
      setIsLoading(false); // Stop loading indicator
    }
  };
  

  return (
    <main className='h-full p-5 rounded-[10px] bg-white'>
      <div className='border rounded-[10px] bg-white md:w-1/2 m-auto p-5 border-slate-500'>
        <h3 className='text-center py-5 text-[#F13934] text-2xl font-bold'>RESET PASSWORD</h3>
        <hr className='w-[80%] m-auto h-1 bg-black' />

        {/* Error Messages */}
        {errorMessages && (
          <div id="authmessage" className='text-center py-3' style={{ color: 'red' }}>
            {errorMessages}
          </div>
        )}

        {/* ResetPassword Form */}
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          {/* Email Field */}
          <label htmlFor="mail" className='my-4 font-bold'>Email:</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address"
              }
            })}
            className="border px-4 border-slate-700 py-2 rounded-full"
            placeholder="Enter Your Email"
            id="mail"
          />
          {errors.email && (
            <span className="text-red-600 text-sm">{errors.email.message}</span>
          )}

          {/* Password Field */}
          <label htmlFor="password" className='my-4 font-bold'>Create Password:</label>
          <input
            type="password"
            className="px-4 border border-slate-700 py-2 rounded-full"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters long" }
            })}
            placeholder="Set password"
            id="password"
          />
          {errors.password && (
            <span className="text-red-600 text-sm">{errors.password.message}</span>
          )}

          {/* Confirm Password Field */}
          <label htmlFor="re-password" className='my-4 font-bold'>Re-type Password:</label>
          <input
            type="password"
            className="px-4 border border-slate-700 py-2 rounded-full"
            placeholder="Re-type password"
            id="re-password"
            {...register("confirmPassword", {
              validate: (value) => value === watch('password') || "Passwords do not match"
            })}
          />
          {errors.confirmPassword && (
            <span className="text-red-600 text-sm">{errors.confirmPassword.message}</span>
          )}

          {/* Submit Button */}
          <input
            type="submit"
            value={isLoading ? 'Submitting...' : 'Submit'}
            disabled={isLoading}
            className='border border-slate-950 bg-[#F0BA30] rounded-full p-3 my-4 text-white font-bold cursor-pointer'
          />
        </form>

        {/* Redirect to Login */}
        <p className='text-center my-4 font-bold'>
          Already have an account? <Link to="/login" className='text-[#F13934] font-bold cursor-pointer'>Login</Link>
        </p>

      </div>

      {/* Toast Notification */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </main>
  );
}

export default ResetPassword;