const express = require("express");

const authRouter = express.Router();

const {validateSignUpData} = require("../utils/validation");

const User = require("../models/user");

const bcrypt = require("bcrypt");

const validator = require("validator");

// const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req,res) => {

    try
    {
      //^ STEP 1: validation of data
      validateSignUpData(req);
  
      //^ STEP 2: Encrypt the password
      //& npm package => bcrypt.js
  
      const{firstName, lastName, emailId, password} = req.body;
  
      const passwordHash = await bcrypt.hash(password, 10);
  
      const user = new User({
        firstName, 
        lastName, 
        emailId, 
        password:passwordHash,
      })
  
      const savedUser = await user.save();  //data will be saved to ur database and it returns a promise
  
      // res.send("User Added successfully");
      //& we want to login that signed up user => i want to set the cookie and also send user as response(same as login)

      const token = await savedUser.getJWT();
  
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8*3600000), //* this is for expiring cookie
        });

      res.json({
        message: "User Added Successfully",
        data : savedUser
      });
  
    } catch(err) {
      res.status(400).send("Error:" + err.message);
    }
  }); 

authRouter.post("/login", async(req,res) => {
    try{
      const{emailId, password} = req.body;
  
      if(!validator.isEmail(emailId))
      {
        throw new Error("INVALID emailId");
      }
  
      const user = await User.findOne({emailId: emailId});

      if(!user)
      {
        throw new Error("Invalid credentials");
      }
  
      const isPasswordValid = await user.validatePassword(password);
  
      if(isPasswordValid)
      {
        const token = await user.getJWT();
  
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8*3600000), //* this is for expiring cookie
        });

        res.send(user);
      }
      else
      {
        throw new Error("Invalid credentials");
      }
  
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  });

authRouter.post("/logout", async(req,res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    })
    res.send("Logout Successful!!");
});

  module.exports = authRouter;