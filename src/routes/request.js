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

module.exports = requestRouter; 