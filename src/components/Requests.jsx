import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addRequest, removeRequest } from '../utils/requestSlice';

const Requests = () => {
  
  const requests = useSelector((store) => store.requests);

  const dispatch = useDispatch();

  const reviewRequest = async(status, requestId) => {
    try{

      const res = await axios.post(BASE_URL + "/request/review/" + status + "/" + requestId, 
        {
          //empty => as this is a post call and i don't have to send any data
        }, 
        {withCredentials: true});

        dispatch(removeRequest(requestId));

    }catch (err){
      console.error(err);
    }
  }


  const fetchRequests = async() => {
    try{
      const res = await axios.get(BASE_URL + "/user/requests/recieved",
        {withCredentials: true},
      );
      // console.log(res?.data);
      dispatch(addRequest(res?.data?.connectionRequests));

    }catch (err)
    {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;

  if(requests.length == 0)
  {
    return (
      <div className="text-center my-10">
          <h1 className="text-4xl font-bold text-gray-500">No Requests Found</h1>
      </div>
    );
  }

  return (
    <div className="my-10">
        <h1 className="text-4xl font-bold text-primary-content text-center tracking-wide mb-6">Requests</h1>
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
            {requests.map((request) => {
                const { firstName, lastName, photoUrl, age, gender, about } = request.fromUserId;
                return (
                    <div key={firstName + lastName} className="flex justify-center"> {/* if key is not added it gives error => always use key when mapping over an array*/ }
                        <div className="w-full max-w-md bg-gradient-to-br from-[#1f2937] to-[#111827] text-white shadow-xl rounded-lg overflow-hidden transform hover:scale-105 transition duration-300">
                            <div className="flex p-6">
                                {/* Profile Image */}
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300 mr-6">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={photoUrl || 'https://via.placeholder.com/150'}
                                        alt="User Avatar"
                                    />
                                </div>

                                {/* Text Content */}
                                <div className="flex-1">
                                    <h2 className="text-2xl font-semibold capitalize">{firstName + " " + lastName}</h2>
                                    <div className="flex justify-start mt-2 text-sm text-gray-300">
                                        {age && gender && (
                                            <p>{age} years old, {gender}</p>
                                        )}
                                    </div>
                                    <p className="mt-3 text-sm text-gray-300">{about || "No description available."}</p>

                                     {/* Buttons */}
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => reviewRequest("accepted",request._id)}
                         className="btn btn-secondary"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => reviewRequest("rejected",request._id)}
                         className="btn btn-primary"
                      >
                        Reject
                      </button>
                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
}

export default Requests;
