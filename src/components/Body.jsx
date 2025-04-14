import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';
import axios  from 'axios';
// import { useNavigate } from 'react-router-dom';

const Body = () => {

  //~ the issue is => when i refresh => we still have token but the user logs out as redux refreshes => so we want to show user profile even after refreshing if there's token present in browser

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //whenever we refresh after logging in => it makes an api call again whenever we refresh and we don't want to do that bcuz we alrdy have user in redux
  const userData = useSelector((store) => store.user);

  const fetchUser = async() => {
    if(userData) return;//^ fetch user only if we don't have it in redux
    try{
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });

      dispatch(addUser(res.data)); //add user to store on component(body) render

    } catch (err) {

      //* we'll get error in case user is trying to access the feed page without login or there's a code error => so we'll navigate the user to login page in case of login error
      if(err.status == 401)
      {
        navigate("/login");
      }
      console.error(err);
    }
  };

  //^ i want to fetch this user when my component is loaded => useEffect hook => whatever is written inside useEffect will run the first time after component is loaded
  useEffect(() => {
      fetchUser(); 
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
  
}

export default Body;
