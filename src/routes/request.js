const express = require("express");
const requestRouter = express.Router();

const {userAuth} = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

//& ONLY FOR INTERESTED AND IGNORED STATUS
requestRouter.post("/request/send/:status/:toUserId", 
  userAuth, 
  async(req,res) => {

    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if(!allowedStatus.includes(status))
      {
        return res.status(400).json({message: "Invalid status type: " + status});
      }

      //* if fromUserId is same as toUserId
      //^ we can simply do it by comparing toUser and FromUser => but lets do it using schema validation "SCHEMA PRE"

      //* Whether toUserId exists
      const toUser = await User.findById(toUserId);
      if(!toUser)
      {
        return res.status(404).json({message: "User not found!"});
      }

      //* IF there is an existing ConnectionRequest
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        //& This is a mongoose mehtod{or followed by an array of conditions}
        $or: [
          {fromUserId, toUserId},//elon musk has already sent cr to alia bhat
          {fromUserId: toUserId, toUserId:fromUserId},//alia bhat has sent connection req to elon musk
        ],
      });

      if(existingConnectionRequest) {
        return res.status(400).send({message: "Connection Request ALready Exist!!"});
         //or throw new error
      }

      //create an instance
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      //save this instance to db
      const data = await connectionRequest.save();

      res.json({
        message: req.user.firstName+" is "+status+" in "+toUser.firstName,
        data,
      });
    } catch (err){
      res.status(400).send("ERROR: " + err.message);
    }  
  }
);

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {
  try {
    const loggedInUser = req.user;
    const {status, requestId} = req.params;

    //^validate the status
    const allowedStatus = ["accepted", "rejected"];

    if(!allowedStatus.includes(status)) {
      return res.status(400).json({message : "Status not allowed"});
    }

    //This queries the MongoDB database using Mongoose. It tries to find one document (i.e., record) in the ConnectionRequestModel collection that matches the conditions.
    const connectionRequest = await ConnectionRequestModel.findOne({
      _id : requestId,
      toUserId : loggedInUser._id,
      status : "interested",
    });

    if(!connectionRequest)
    {
      return res.status(404).json({messgae : "Connection request not found"});
    }

    connectionRequest.status = status; 

    const data = await connectionRequest.save();

    res.json({message: "Connection request" + status, data});
     
    //akshay => elon
    //* is elon logged in??
    //* existing status should be interested state
    //* request id should be valid

  }
  catch(err) {
    res.status(400).send("ERROR :" + err.message);
  }

});

module.exports = requestRouter; 