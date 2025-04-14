import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/feedSlice';
import axios from 'axios';
import UserCard from './UserCard';

const Feed = () => {

  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async() => {
    try{

      if(feed) return; //if feed is alrdy there => return

      const res = await axios.get(BASE_URL + "/feed", {withCredentials: true,});

      dispatch(addFeed(res?.data?.data));
    } catch(err)
    {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if(!feed) return;

  if(feed.length <= 0) {
    return (
      <div className="text-center my-10">
          <h1 className="text-4xl font-bold text-gray-500">No New Users Found</h1>
      </div>
  );
  }

  return (
    feed && (
    <div className='flex justify-center my-10'>
      <UserCard user={feed[0]}/>
    </div>)
  )
}

export default Feed
