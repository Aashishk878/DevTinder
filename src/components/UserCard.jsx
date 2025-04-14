import axios from 'axios';
import React from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { removeUserFromFeed } from '../utils/feedSlice';

const UserCard = ({user}) => {
    // console.log(user);
    const {_id, firstName, lastName, photoUrl, age, gender, about, skills} = user;

    const dispatch = useDispatch();

    const handleSendRequest = async(status, userId) => {
      try{

        const res = await axios.post(BASE_URL + "/request/send/" + status + "/" + userId, 
          {
            //empty since we don't wanna pass any data
          },
        {withCredentials : true},
      );

      dispatch(removeUserFromFeed(userId));

      } catch(err) {
        console.error(err);
      }
    }

  return (
    <div className="flex justify-center">
      <div className="card w-96 bg-gradient-to-br from-[#1f2937] to-[#111827] text-white shadow-xl rounded-2xl overflow-hidden transform hover:scale-105 transition duration-300">
      <figure className="relative h-60 overflow-hidden">
  <img
    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
    src={photoUrl}
    alt="User Banner"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
</figure>
        <div className="card-body text-center">
        <h2 className="text-xl font-bold capitalize">
            {firstName + " " + lastName}
          </h2>
          {age && gender && (
            <p className="text-sm text-gray-400">{age} years old, {gender}</p>
          )}
          <p className="mt-2 text-sm text-gray-300 px-4 whitespace-pre-line break-words">{about || "No description available."}
          </p>
          <div className="card-actions justify-center mt-4">
          <button className="btn bg-gradient-to-r from-purple-600 to-blue-500 hover:brightness-110 text-white font-medium px-4 py-2 rounded-md"
          onClick={() => handleSendRequest("ignored", _id)}>
              Ignore
            </button>
            <button className="btn bg-gradient-to-r from-pink-500 to-red-500 hover:brightness-110 text-white font-medium px-4 py-2 rounded-md"
            onClick={() => handleSendRequest("interested", _id)}>
              Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
