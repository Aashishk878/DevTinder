const jwt = require('jsonwebtoken');

const User = require("../models/user");


const userAuth = async (req,res,next) => {

    //^ Read the token from the req cookies
    
    // const cookies = req.cookies;

   try{
        const {token} = req.cookies;

        if(!token)
        {
            // throw new Error("Token is not valid!!!");
            return res.status(401).send("Please login"); 
            //& 401 => u are not authorised
        }

        const decodedObj = await jwt.verify(token, "DEV@Tinder$790");
        // console.log(decodedObj);

        const {id} = decodedObj;
        // console.log(id);
        const user = await User.findById(id);

        // console.log(user);

        if(!user)
        {
            throw new Error("User not found");
        }

        req.user = user;
        next(); //next is called to move to the req handler
    }
    catch(err)
    {
        res.status(400).send("ERROR: " + err.message);
    }
    //^ Validate the token
    //^ Find the user


};

module.exports = {
    userAuth
};