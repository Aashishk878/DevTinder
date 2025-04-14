import axios from 'axios';
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addConnections } from '../utils/connectionSlice';

const Connections = () => {

    const connections = useSelector((store) => store.connections);

    const dispatch = useDispatch();

    const fetchConnections = async()=> {
        try{
            const res = await axios.get(BASE_URL + "/user/connections", 
            {withCredentials: true}
            );

            // console.log(res);
            dispatch(addConnections(res.data.data));

        }catch(err)
        {
            console.error(err);
        }
    }

    
    useEffect(() => {
        fetchConnections();
    }, []);

    if(!connections) return;

    if(connections.length == 0)
    {
        return (
            <div className="text-center my-10">
                <h1 className="text-4xl font-bold text-gray-500">No Connections Found</h1>
            </div>
        );
    }

    return (
        <div className="my-10">
        <h1 className="text-4xl font-bold text-primary-content text-center tracking-wide mb-6">Connections</h1>
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
            {connections.map((connection) => {
                const { firstName, lastName, photoUrl, age, gender, about } = connection;
                return (
                    <div key={firstName + lastName} className="flex justify-center">
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
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
    );
};

export default Connections;
