import React from 'react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Newsletter() {

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [errorMessages, setErrorMessages] = useState('');
  const navigate = useNavigate(); // Hook to handle navigation
  const notify = () => toast("Registration Successful!");



  const onSubmit = async (data) => {

    const formData = new FormData();
    
    formData.append('email', data.email);
    formData.append('terms', data.terms);


    try {
        const response= await axios.post('http://localhost:3007/newsletter',{
            email: data.email,
            terms: data.terms ? 1 : 0,
        });
        if (response.status === 201) {
          reset(); // Clear form inputs
          notify()
          setErrorMessages(''); // Clear any previous error messages
          
          // Redirect after a short delay
          setTimeout(() => {
              navigate('/');
          }, 2000);
        }else {
          // Handle unexpected statuses
          setErrorMessages("Unexpected response from server. Please try again.");
      }
        }catch(err)  {
          if (err.response) {
            const { status, data } = err.response;
            
            // Handle specific server response errors
            if (status === 400) {
                setErrorMessages(data.message || "Validation failed. Please check your input.");
            } else if (status === 500) {
                setErrorMessages(data.message || "Server error. Please try again later.");
            } else {
                setErrorMessages(data.message || "An error occurred. Please try again.");
            }
        } else {
            // General error (e.g., network issues)
            setErrorMessages("Unable to connect to the server. Please check your internet connection.");
        }
        console.error(err); // Log the error for debugging
        };
      };    

    useEffect(() => {
        AOS.init({
          duration: 1000,
          easing: 'ease-in-out',
          once: true,
        });
      }, []);


  //const [showSuccess, setShowSuccess] = useState(false);
  

  return (
    <main className="mt-[130px] shadow-lg h-screen">

        {/* Newsletter Signup */}
        <section className="mt-10 pt-5">
            <h2 className="text-xl text-center font-semibold text-purple-600">Stay up to date</h2>
            <p className="text-gray-600 text-center" >Join Our Newsletter</p>

            {errorMessages && (
              <div id="authmessage" className='text-red-600 py-2   text-center'>
                {errorMessages}
              </div>
            )}

            <form 
            noValidate
             onSubmit={handleSubmit(onSubmit)} 
              className=" py-10 flex flex-col w-full md:w-1/2 m-auto shadow-lg items-center">
              
              <div>
              <input 
                type="email" 
                autoFocus
                placeholder="Enter your email..."
                {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address"
                    }
                  })}
                className="p-2 border border-gray-300 rounded mb-3 lg:mb-0 lg:mr-2 w-full lg:w-auto" 
                required
              />
                {errors.email && (
                    <span className="text-red-600 text-sm">{errors.email.message}</span>
                    )}
              </div> 
              <div className='flex items-center'>
              <input type="checkbox" name="terms" id="subscribe"
              {...register("terms", { required: "You must agree to Terms" })}
               className="mx-3"/>
              <label htmlFor="subscribe" className="text-sm text-gray-500">I Acknowledge to receive newsletter</label>
             
              {errors.terms && (
                    <span className="text-red-600 text-sm">{errors.terms.message}</span>
                    )}

                
                </div>
                 <div className='py-3'>
              <button type="submit" className="px-3 py-1 text-white bg-[#800080] rounded"> Submit</button>
                
                </div>

              
            </form>
            <p className="text-xs text-gray-500 text-center  mt-5">*You can unsubscribe anytime</p>
          </section>

          {/* Success Message */}
          {/* {showSuccess && (
            <div className="mt-4 p-4 bg-green-200 text-green-800 rounded">
              You have submitted successfully!
            </div>
          )} */}

<ToastContainer
        position="top-center"
        autoClose={3000} // Automatically close after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </main>
  )
}

