const express = require("express");

const {userAuth} = require("../middlewares/auth");

const {validateProfileEditData} = require("../utils/validation");

const profileRouter = express.Router();

//~ GET profile of the user
profileRouter.get("/profile/view", userAuth, async(req, res) => { 
    
    try{
      const user = req.user;
  
      if(!user)
      {
        throw new Error("User does not exist");
      }
      res.send(user);
      
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
  });

profileRouter.patch("/profile/edit", userAuth, async(req,res) => {
    
    try{
        if(!validateProfileEditData(req)){

            throw new Error("Invalid Edit Request");
            // return res.status(400).send("")
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();//save the updated user in db

        // console.log(user);

        // res.send("Profile updated successfully");
        //we can also do it like this : 
        res.json({
            message: `${loggedInUser.firstName}, your profile has been updated successfully`,
            data : loggedInUser
        })

    }catch (err) {
        res.status(400).json("ERROR : " + err.message);
    }
})

  module.exports = profileRouter;