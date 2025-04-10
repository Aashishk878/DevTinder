const express = require("express");
const userRouter = express.Router();

const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")

const User = require("../models/user");

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
        res.statusCode(400).send("ERROR : " + err.message);
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

userRouter.get("/feed", userAuth, async(req, res) => {
    try{
        //~ think => User should see all the user cards except:
        
        //* 0. his own card
        //* 1. his connections
        //* 2. ignored people
        //* 3. already sent the connection request 

        //& this means => if there's an entry in connectionRequest table => then the card should not be seen

        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        limit = limit > 50 ? 50 : limit;//sanitise limit

        //find all connection requests(sent + recieved)
        const requests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id },
            ]
        }).select("fromUserId toUserId");
        // .populate("fromUserId", "firstName")
        // .populate("toUserId", "firstName");

        const hideUsersFromFeed = new Set();

        requests.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        // console.log(hideUsersFromFeed);
        const users = await User.find({
            $and: [
                { _id : { $nin : Array.from(hideUsersFromFeed) } },
                {_id : { $ne : loggedInUser._id } } 
            ],
        }).select(USER_SAFE_DATA).skip((page - 1)*limit).limit(limit);
        //array.from converts the set into an error
        //nin => not in => it returns all the id's which is not present in hideUsersfromFeed
        //ne = not equal to => mongodb query operators

        //& PAGINATION => we want to only show 10 users at a time in a feed not all of them
        //^ /feed?page=1&limit=10 => first 10 users 1-10 => .skip(0)&.limit(10) 

        //^ /feed?page=2&limit=10 => 11-20 => .skip(10)&.limit(10)

        //^ /feed?page=3&limit=10 => 21-30

        //* two imp functions of mongo : 
        //* .skip() => how many entries to skip from the first
        //* .limit() => how many entries to show
    

        res.json({ data: users });

    } catch(err)
    {
        res.status(400).json({ message: err.message });
    }

});

module.exports = userRouter;

