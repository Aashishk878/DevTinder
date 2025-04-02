const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: {
                //* enum is when there's a certain fixed value possible
                values: ["ignored", "interested", "accepted", "rejected"],
                message: `{VALUE} is incorrect status type`, //* if anything other than the given values is typed
            },
        },
    },
    {
        timestamps:true,
    }
);

//& similar to middleware
connectionRequestSchema.pre("save", function(next) {
    //! DONT USE ARROW FUNC HERE
    const connectionRequest = this;
    //check if the fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection req to yourself");
    }
    next();
});

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequestModel",
    connectionRequestSchema
);

module.exports = ConnectionRequestModel;