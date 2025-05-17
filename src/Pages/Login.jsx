// src/Pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import axios from 'axios';


function Login() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [errorMessages, setErrorMessages] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const apiUrl = import.meta.env.VITE_API_KEY;
    


    const notifySuccess = () => toast.success("Logged In Successfully!");
    const notifyError = (message) => toast.error(message);

 


    // Submit handler for email/password login
    const onSubmit = async (data) => {
        setIsLoading(true);
       

        try {   
            const response= await axios.post(`${apiUrl}:5001/api/login`, {
                email:data.email,
                password:data.password
            });

            // console.log(" Login Response:", response.data);
            if (response.status === 200) {
            notifySuccess();
            dispatch(loginSuccess({ user: response.data.user, token: response.data.token }));
            reset();
            setErrorMessages('');
            const token = response.data.token;
            localStorage.setItem('authToken', token);
            
            setTimeout(() => navigate('/profile'), 2000);
            }else {
                // Handle unexpected statuses
                setErrorMessages("Unexpected error. Please try again.");
            }
        } catch (err) {
            // console.error("Error during login:", err.response?.data || err.message);
            setErrorMessages("Invalid Email/Password");
            notifyError("Invalid Email/Password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className='h-full pt-5 pb-11 rounded-[10px] bg-white'>
            <div className='border md:w-1/2 rounded-[10px] m-3 md:m-auto p-5 border-slate-500'>
                <h3 className='text-center py-5 font-bold text-[#F13934] text-2xl'>LOGIN</h3>
            <hr className='w-[80%] h-1 m-auto bg-black' />

                {errorMessages && (
                    <div id="authmessage" className='text-center py-3 text-red-600'>
                        {errorMessages}
                    </div>
                )}

                <form className="flex flex-col" noValidate onSubmit={handleSubmit(onSubmit)}>
                    <label className='my-4 font-bold' htmlFor="uname">Email:</label>
                    <input
                        autoFocus
                        className="border border-slate-700 py-2 px-5 rounded-full"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: "Invalid email address"
                            }
                        })}
                        placeholder="Enter Your Email"
                        type="email"
                        id="uname"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}

                    <label className='my-4 font-bold' htmlFor="password">Password:</label>
                    <input
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters long" }
                        })}
                        placeholder="Password"
                        className="border py-2 px-5 border-slate-700 rounded-full"
                        id="password"
                    />
                    {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}

                    <input
                        type="submit"
                        className='border border-slate-950 text-black font-bold rounded-full p-3 mt-7 bg-[#F0BA30] cursor-pointer'
                        value={isLoading ? 'Submitting...' : 'Submit'}
                        disabled={isLoading}
                    />
                </form>

                <p className='text-center mt-3'>
                        Forgot your password? <span  className='text-[#F13934] font-bold cursor-pointer'>
                            <Link to="/reset-password">
                            Reset Password
                            </Link>
                            </span>
                    </p>

                  

                    <p className='text-center mt-3'>
                        Don't have an account? <Link to="/signup" className='text-[#F13934] font-bold'>Sign Up</Link>
                    </p>
            </div>

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
}

export default Login;