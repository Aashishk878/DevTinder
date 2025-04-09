const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref : "User", //creating reference to user collection
            required: true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref : "User",
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

//compound index
connectionRequestSchema.index({fromUserId : 1, //1 -> ascending order, -1 => desc. order
    toUserId : 1
})

//* mongoDB indexes => if 1000 users send request to each other => there will be around 1000*1000 entries in db => when we use find function on db...it'll be very time consuming => indexes make this query faster

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