import React, { useState } from 'react';
import UserCard from './UserCard';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';

const EditProfile = ({user}) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const[showToast, setShowToast] = useState(false);

  const saveChanges = async() => {
    try{
        // console.log("Gender selected:", gender);
        const res = await axios.patch(BASE_URL + "/profile/edit",{
            firstName, 
            lastName, 
            photoUrl, 
            age, 
            gender, 
            about}, 
            {withCredentials: true});

            dispatch(addUser(res.data?.data));//update store
            setShowToast(true);

            const interval = setTimeout(() => {
                setShowToast(false);
            }, 3000); //to remove toast after 3 seconds

    } catch(err)
    {
        setError(err?.response?.data);
        console.error(err);
    }
  };

  return (
    <>
    <div className='flex flex-col md:flex-row justify-center items-start gap-10 my-15'>
  <div className="flex justify-center mx-10">
    <div className="card bg-base-300 w-96 shadow-sm">
      <div className="card-body">
          <h1 className="card-title flex justify-center my-2">Edit Profile</h1>

          {/* First Name */}
          <label className="input validator">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              minLength={4}
              maxLength={50}
              required
              onChange={(e) => {setFirstName(e.target.value), setError("")}}
            />
          </label>

          {/* Last Name */}
          <label className="input validator mt-2">
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => {setLastName(e.target.value),setError("")}}
              minLength={2}
              maxLength={30}
              required
            />
          </label>

          {/* Age */}
          <label className="input validator mt-2">
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => {setAge(e.target.value), setError("")}}
              min={10}
              max={100}
              required
            />
          </label>

          {/* Gender */}
          <label className="input validator mt-2">
  <select
    className="w-full bg-base-100 border border-gray-600 rounded-md text-sm text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
    value={gender}
    onChange={(e) => {setGender(e.target.value), setError("")}}
    required
  >
    {/* {console.log(e.target.value)}; */}
    <option value="" disabled>Select Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Other">Other</option>
    <option value="Prefer not to say">Prefer not to say</option>
  </select>
</label>

          {/* Photo URL */}
          <label className="input validator mt-2">
            <input
              type="url"
              placeholder="Photo URL"
              value={photoUrl}
              onChange={(e) => {setPhotoUrl(e.target.value), setError("")}}
              required
            />
          </label>

          {/* About (Textarea) */}
          <label className="mt-2">
            <span className="text-sm text-gray-400">About</span>
            <textarea
              className="textarea mt-1 w-full px-3 py-2 bg-base-100 border border-gray-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary  h-24"
              placeholder="Write something about yourself..."
              value={about}
              onChange={(e) => {setAbout(e.target.value), setError("")}}
              maxLength={250}
              required
            />
          </label>

          {error && (
            <p className="text-red-500 text-center text-sm mt-2">{error}</p>
          )}

          <div className="card-actions justify-center my-4">
            <button className="btn btn-primary" onClick={saveChanges}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className='my-15 mx-10 '>
     <UserCard user = {{firstName, lastName, photoUrl, age, gender, about}} />
     </div>
     </div>

     {showToast &&
     (<div className="toast toast-top toast-center animate-fade-in-down transition-opacity duration-300">
        <div className="alert alert-success flex items-center gap-3 shadow-lg rounded-md px-4 py-3 w-fit">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 stroke-current text-green-600" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-green-700">Profile updated successfully!</span>
        </div>
      </div>)}
     </> 
  );
};

export default EditProfile;
