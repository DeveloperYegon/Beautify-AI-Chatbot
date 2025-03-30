import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import {jwtDecode} from "jwt-decode";
import Logout from "./Logout";
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, updateUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function Profile() {
  const dispatch = useDispatch();
  const { data: user, isLoading, error } = useSelector((state) => state.user);
  const [errorMessages, setErrorMessages] = useState('');
  const [updatedUser, setUpdatedUser] = useState(null);
  const navigate = useNavigate();

  const skinTypes = ["Oily", "Dry", "Combination", "Sensitive", "Normal"];
  const lifestyle= ["Active", "Sedentary", "Moderate", "Highly Active","workaholic","Gym Rat"];
  const Environ= ["Dry Climate","Significant Sun Exposure"," Humid Climate", "Urban", "Rural", "Coastal"];
  const concerns = ["Acne", "Hyperpigmentation", "Razor Bumps", "Aging", "Dull Skin"];

  //  Extract userId from JWT token
  const token = localStorage.getItem('authToken');
  if (!token) {
    navigate("/login")
  }
  let userId = null;
  try {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.userId; // Extract user ID from token
  } catch (error) {
    console.error(" Error decoding token:", error);
  }

  console.log("User ID:", userId);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUser(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setUpdatedUser(user);
    }
  }, [user]);

   // Handle input changes
   const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? checked
          ? [...(prev?.concerns || []), value]
          : prev?.concerns?.filter((c) => c !== value)
        : value,
    }));
  };

  

  //  Save updated profile
  const handleSave = async (e) => {
    e.preventDefault();
    if (!updatedUser) return;
    console.log(user);
    try {
      dispatch(updateUser({ ...updatedUser, userId }));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile. Please try again later.");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <main className="h-full p-5 bg-white rounded-[10px]">

      <h1 className="md:text-5xl text-center text-2xl my-10">Welcome here: <span className="text-[#F13934] md:text-5xl text-2xl">{updatedUser?.name}</span> ?</h1>
      <div className=' md:w-1/2 rounded-[10px] m-auto p-5'>
        <h3 className='text-center py-5 font-bold text-[#F13934] text-2xl'>Update Profile</h3>
        <hr className='w-[80%] h-1 m-auto bg-black' />

        {errorMessages && <div className='text-center py-3 text-red-600'>{errorMessages}</div>}

        <form className="flex m-5 p-3 flex-col">
          <label className="font-bold py-3" htmlFor="name">Name:</label>
          <input className="bg-slate-300 border p-3 rounded-xl" type="text" name="name" value={updatedUser?.name || ""} onChange={handleChange} placeholder="Enter your name"/>

          <label className="font-bold py-3" htmlFor="email">Email:</label>
          <input className="bg-slate-300 border p-3 rounded-xl" type="email" name="email" value={updatedUser?.email || ""} disabled/>

          <label className="font-bold py-3" htmlFor="role">Role:</label>
          <input className="bg-slate-300 border p-3 rounded-xl" type="text" value={updatedUser?.role || ""} disabled />


          <label className="font-bold py-2" htmlFor="concerns">User Concerns/Preferences:</label>
          <div className="flex bg-slate-300 border rounded-xl p-3 my-5 flex-col ">
            {concerns.map((concern) => (
              <label key={concern} className="flex  items-center mr-4">
                <input type="checkbox" name="concerns" className="mr-2  bg-[#F0BA30]" value={concern} checked={Array.isArray(updatedUser?.concerns) && updatedUser?.concerns.includes(concern)} onChange={handleChange}/>
                {concern}
              </label>
            ))}
          </div>

          <label className="font-bold py-3" htmlFor="skinType">Skin Type:</label>
          <select name="skinType" className="bg-slate-300 border p-3 rounded-xl" value={updatedUser?.skinType || ""} onChange={handleChange}>
            <option value="">Select Skin Type</option>
            {skinTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>

         

          <label className="font-bold py-3" htmlFor="lifestyle">Lifestyle:</label>
          <select name="lifestyle" className="bg-slate-300 border p-3 rounded-xl" id="lifestyle" value={updatedUser?.lifestyle || ""} onChange={handleChange}>
            <option value=""> Select lifestyle</option>
            {lifestyle.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>


          <label className="font-bold py-3" htmlFor="Environ">Environmental Factors:</label>
            <select name="Environ" id="Environ" className="bg-slate-300 border p-3 rounded-xl" value={updatedUser?.Environ || "" } onChange={handleChange}>
              <option value="">Select Environmental factors</option>
              {Environ.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>

            <label className="font-bold py-3" htmlFor="age">Age:</label>
            <input className="bg-slate-300 border p-3 rounded-xl" type="number" name="age" value={updatedUser?.age || ""} onChange={handleChange} placeholder="Enter your age"/>
            <label className="font-bold py-3" htmlFor="gender">Gender:</label>
            <select name="gender" id="gender" className="bg-slate-300 border p-3 rounded-xl" value={updatedUser?.gender || ""} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <label className="font-bold py-3" htmlFor="hairType">Hair Type:</label>
            <select name="hairType" id="hairType" className="bg-slate-300 border p-3 rounded-xl" value={updatedUser?.hairType || ""} onChange={handleChange}>
              <option value="">Select Hair Type</option>
              <option value="Straight">Straight</option>
              <option value="Wavy">Wavy</option>
              <option value="Curly">Curly</option>
              <option value="Kinky">Kinky</option>
            </select>
            <label className="font-bold py-3" htmlFor="hairColor">Hair Color:</label>
            <select name="hairColor" id="hairColor" className="bg-slate-300 border p-3 rounded-xl" value={updatedUser?.hairColor || ""} onChange={handleChange}>
              <option value="">Select Hair Color</option>
              <option value="Black">Black</option>
              <option value="Brown">Brown</option>
              <option value="Blonde">Blonde</option>
              <option value="Red">Red</option>
            </select>
            <label className="font-bold py-3" htmlFor="eyeColor">Eye Color:</label>
            <select name="eyeColor" id="eyeColor" className="bg-slate-300 border p-3 rounded-xl" value={updatedUser?.eyeColor || ""} onChange={handleChange}>
              <option value="">Select Eye Color</option>
              <option value="Brown">Brown</option>
              <option value="Blue">Blue</option>
              <option value="Green">Green</option>
              <option value="Hazel">Hazel</option>
            </select>
            <div className="flex items-center gap-4 bg-slate-300 border rounded-xl p-3 my-5"> 
            <label className=" " htmlFor="premium">Premium:</label>
            <input type="checkbox" name="isPremium" id="premium" className="bg-[#F0BA30]" checked={updatedUser?.isPremium || false} disabled onChange={handleChange}/>
            </div>
            <div className="flex items-center gap-4 bg-slate-300 border rounded-xl p-3 my-5"> 
            <label className=" " htmlFor="terms">Terms:</label>
            <input type="checkbox" name="termsAccepted" disabled id="terms" className="bg-[#F0BA30]" checked={updatedUser?.termsAccepted || false} onChange={handleChange}/>
            </div>
            <label className="" htmlFor="subscriptionAmount">Subscription Amount:</label>
            <input type="number" name="subscriptionAmount" disabled id="subscriptionAmount" className="bg-slate-300 border p-3 rounded-xl" value={updatedUser?.subscriptionAmount || ""} onChange={handleChange}/>
            <label className="" htmlFor="subscriptionDate">Subscription Date:</label>
            <input type="date" name="subscriptionDate" disabled id="subscriptionDate" className="bg-slate-300 border p-3 rounded-xl" value={updatedUser?.subscriptionDate ? updatedUser.subscriptionDate.split("T")[0] : ""} onChange={handleChange}/>
            <label className="" htmlFor="subscriptionEndDate">Subscription End Date:</label>
            <input type="date" name="subscriptionExpiry" disabled id="subscriptionEndDate" className="bg-slate-300 border p-3 rounded-xl" value={updatedUser?.subscriptionExpiry ?updatedUser.subscriptionExpiry.split("T")[0] : ""} onChange={handleChange}/>
            <label className="" htmlFor="subscriptionPlan">Subscription Plan:</label>
            <input type="text" name="subscriptionPlan" disabled id="subscriptionPlan" className="bg-slate-300 border p-3 rounded-xl" value={updatedUser?.subscriptionPlan || ""} onChange={handleChange}/>
            <label className="" htmlFor="subscriptionStatus">Subscription Status:</label>
            <input type="text" name="subscriptionStatus" disabled id="subscriptionStatus" className="bg-slate-300 border p-3 rounded-xl" value={updatedUser?.subscriptionStatus || ""} onChange={handleChange}/>
            <label classname="" htmlFor="skinTone">Skin Tone:</label>
            <select name="skinTone" id="skinTone" className="bg-slate-300 border p-3 rounded-xl" value={updatedUser?.skinTone || ""} onChange={handleChange}>
              <option value="">Select Skin Tone</option>
              <option value="Fair">Fair</option>
              <option value="Medium">Medium</option>
              <option value="Dark">Dark</option>
            </select>
          {/*  Correct Save Button */}
          <button className="bg-[#F0BA30] text-black font-black px-4 py-3 rounded-lg mt-5" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </button>
        </form>

        <ToastContainer />
      </div>

      <Logout/>
    </main>
  );
}

export default Profile;
