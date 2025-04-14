import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from "../utils/constants"
import { removeUser } from '../utils/userSlice';

const NavBar = () => {
  const user = useSelector(store => store.user);
  // console.log(user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async() => {
    try{
      await axios.post(BASE_URL + "/logout", 
        {}, 
        {withCredentials: true}
      );

      //& it should also clear user from redux store
      dispatch(removeUser());

      return navigate("/login");

    }catch(err)
    {
      //~ Error logic => redirect to error page
      console.error(err);
    }
  }

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
        👩‍💻DevTinder
        </Link>
      </div>
      {user && (
        <div className="flex gap-2 items-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-4 text-white max-w-md my-2">
            <h2 className=" font-bold">Welcome back, {user.firstName} 👋</h2>
          </div>
          <div className="dropdown dropdown-end mx-5 flex">
            {/* <p className='px-4'>Welcome, {user.firstName}</p> */}
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="User-photo" src={user.photoUrl} />
              </div>{' '}
              {/*//&show the photo only when the user is logged in*/}
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-14 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  {/* <span className="badge">New</span> */}
                </Link>
              </li>
              <li>
                <Link to="/connections" className="justify-between">
                  Connections
                  {/* <span className="badge">New</span> */}
                </Link>
              </li>
              <li>
                <Link to="/requests" className="justify-between">
                  Requests
                  {/* <span className="badge">New</span> */}
                </Link>
              </li>
              
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
