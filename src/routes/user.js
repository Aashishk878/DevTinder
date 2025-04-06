const express = require("express");
const userRouter = express.Router();

const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")

//* Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests", userAuth, async(req,res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested",
        });


        res.json()

    }
    catch (err) {
        req.statusCode(400).send("ERROR : " + err.message);
    }
})

module.exports = userRouter;

