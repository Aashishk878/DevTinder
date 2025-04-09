const express = require("express");
const userRouter = express.Router();

const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

//* Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/recieved", userAuth, async(req,res) => {
    try{
        const loggedInUser = req.user;

        // const connectionRequests = await ConnectionRequest.find({
        //     toUserId : loggedInUser._id,
        //     status : "interested",
        // });
        
        //^ we have got toUserId and fromUserId as output => but we also need names of people who sent requests => either we could just loop over the object and extract the required data from user table which is a bad way; instead we can form a relation between two table i.e, from connectionRequest to user
        
        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested",
        }).populate("fromUserId",USER_SAFE_DATA);
        
        // populate("fromUserId", ["firstName", "lastName"]); 
        
        //jisse reference create kiya h, array or string of properties we want to extract of that reference from user collection //* if we only pass fromUserId => it'll send all the data of fromUserId
        
        res.json({ connectionRequests });

    }
    catch (err) {
        req.statusCode(400).send("ERROR : " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async(req, res) => {
    try{

        const loggedInUser = req.user;

        //* alia => elon => accepted : alia can be fromUser or toUser

        const connections = await ConnectionRequest.find({
            $or : [
                { toUserId : loggedInUser._id, status : "accepted"},
                { fromUserId: loggedInUser._id, status : "accepted"},
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connections.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString())
            {
                return row.toUserId;
            }
            return row.fromUserId;
        }); //just send the fromUserId and its details not the other stuff

        res.json({ data });

    }catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

module.exports = userRouter;

