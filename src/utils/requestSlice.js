import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
    name: "requests",
    initialState: null,
    reducers: {
        addRequest : (state, action) => {
            return action.payload;
        },
        removeRequest : (state, action) => {
            //initially the state would be having the requests recieved
            //now i want to remove that specific request which i reviewed

            const newArray = state.filter(r => r._id !== action.payload);
            return newArray;
        },
    },
});

export const {addRequest, removeRequest} = requestSlice.actions;

export default requestSlice.reducer;