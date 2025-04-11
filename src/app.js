const express = require("express");
const connectDB = require("./config/database");

const app = express();
const cors = require("cors")

// const User = require("./models/user");
// const {validateSignUpData} = require("./utils/validation");
// const bcrypt = require("bcrypt");
// const validator = require("validator");

const cookieParser = require("cookie-parser");

// const jwt = require("jsonwebtoken");
// const {userAuth} = require("./middlewares/auth");

// //handles only get routes to /test
// app.get('/test', (req, res) => {
//   res.send({ Firstname: 'Aashish', lastName: 'Kumar' });
// });
// app.post('/test', (req, res) => {
//   //saving the data to db
//   res.send('Data saved successfully');
// });

// // /ac, /abc => both will work => b is optional
// app.get('/ab?c', (req, res) => {
//   res.send({ Firstname: 'Aashish', lastName: 'Kumar' });
// });

// // bc is optional
// app.get('/a(bc)?d', (req, res) => {
//   res.send({ Firstname: 'Aashish', lastName: 'Kumar' });
// });

// // /abc, /abbc, /abbbbc, /abbbbbbbbbbbbbc will work
// app.get('/ab+c', (req, res) => {
//   res.send({ Firstname: 'Aashish', lastName: 'Kumar' });
// });

// //if route starts with anything but ends with fly => e.q, butterfly => regex
// app.get('/*fly$/', (req, res) => {
//   res.send({ Firstname: 'Butter', lastName: 'fly' });
// });

// // we can give any route that starts with ab and ends with c
// app.get('/ab*c', (req, res) => {
//   res.send({ Firstname: 'Aashish', lastName: 'Kumar' });
// });

// //if the path contains a => it will work => Regex
// app.get('/a/', (req, res) => {
//   res.send({ Firstname: 'Aashish', lastName: 'Kumar' });
// });

// //query parameters
// // app.get("/user", (req,res) => {
// //     console.log(req.query);
//     // res.send({Firstname : "Aashish", lastName : "Kumar"})
//     //^ if we dont send response => an inifnity loop like thing starts where there's no response and we'll get a timeout error eventually
// // })

// //^ a single route can have more than one handlers => SYNTAX :

// // app.get(
// //   '/user',
// //   (req, res) => {
// //     console.log('request handler 1');
// //     // res.send('req handler one');
//     //^ if we do not write res.send in first route handler => will it go to second route handler?? =>> NOOOO
//     //~ we need a next pointer for that
// //   },
// //   (req, res) => {
// //     console.log('handling the route 2');
// //     res.send('req handler two');
// //   }
// // );

// //!VARIATION 1
// // app.get(
// //   '/user',
// //   (req, res, next) => {
// //     console.log('request handler 1');
//     // res.send('req handler one');
// //     next(); //! next reponse handler
// //   },
// //   (req, res) => {
// //     console.log('handling the route 2');
// //     res.send('req handler two');//& output => req handler two 
// //   }
// // );

// //!VARIATION 2 ==> Gives an error as we try to send two responses => in case of first response a tcp/ip connection is made between postman and code => response is handled => connection is closed => then we're sending the response again on same connection
// // app.get(
// //   '/user',
// //   (req, res, next) => {
// //     console.log('request handler 1');
// //     res.send('req handler one');
// //     next(); //! next reponse handler
// //   },
// //   (req, res) => {
// //     console.log('handling the route 2');
// //     res.send('req handler two');
// //   }
// // );

// //!VARIATION 3 ==>  Cannot set headers after they are sent to the client error
// // app.get(
// //   '/user',
// //   (req, res, next) => {
// //     console.log('request handler 1');
// //     next(); //! next reponse handler => after calling next => code jumps to next handler...executes it
// //     res.send('req handler one');//& and then this line runs => giving an error as we sent response again on same connection
// //   },
// //   (req, res) => {
// //     console.log('handling the route 2');
// //     res.send('req handler two');//& output => req handler two 
// //   }
// // );

// //!VARIATION 4 ==>  next at last route handler
// // app.get(
// //   '/user',
// //   (req, res, next) => {
// //     console.log('request handler 1');
// //     next(); //! next reponse handler => after calling next => code jumps to next handler...executes it
//     // res.send('req handler one');
// //   },
// //   (req, res, next) => {
// //     console.log('handling the route 2');
//     // res.send('req handler two');
// //     next();
// //   }
// // );

// //!VARIATION 5 ==>  array of route handler => NO DIFFERENCE => WORKS THE SAME WAY
// // app.get(
// //   '/user',
// //   [(req, res, next) => {
// //     console.log('request handler 1');
// //     next(); 
// //     // res.send('req handler one');
// //   },
// //   (req, res, next) => {
// //     console.log('handling the route 2');
// //     res.send('req handler two');
// //     next();
// //   }],
// //   (req,res,next) => {
// //     console.log('req handler three')
// //   }
// // );

// //^ Summary => app.use("/route", rH1, rH2, rH3, rH4) or 
// //^ app.use("/route", [rH1, rH2, rH3, rH4]) 
// //^ or app.use("/route", [rH1, rH2], rH3, rH4)
// //! all of them works the same way 

// //!VARIATION 6 
// app.get(
//     '/user',
//     (req, res, next) => {
//       console.log('request handler 1');
//       next(); 
//       // res.send('req handler one');
//     })
// app.get(
//     '/user',
//     (req, res, next) => {
//       console.log('handling the route 2');
//       res.send('req handler two');//&output : req handler two  
//     }
//   );

// //req parameters
// app.get('/user/:userId', (req, res) => {
//   console.log(req.params);
//   res.send({ Firstname: 'Aashish', lastName: 'Kumar' });
// });

// //handles all the request to the /test route => get, post, patch, delete
// app.use('/test', (req, res) => {
//   res.send('Hello from the server!');
// });


//& Middleware for json format provided by express

app.use(cors
  ({
  //cookies were not set bcuz if we're not on the same domain or we're not on a secure network => the axios/browser doesn't allow setting cookies  => so we've to use corsoptions to whitelist some domains

  origin: "http://localhost:5173",//FROM WHERE THE FRONTEND IS HOSTED
  credentials: true,

  })
);
app.use(express.json()); //it'll be activated for all the routes(middleware)
app.use(cookieParser());

//~ SIGNUP api
// app.post("/signup", async (req,res) => {

//   try
//   {
//     //^ STEP 1: validation of data
//     validateSignUpData(req);

//     //^ STEP 2: Encrypt the password
//     //& npm package => bcrypt.js

//     const{firstName, lastName, emailId, password} = req.body;

//     const passwordHash = await bcrypt.hash(password, 10);
//     // console.log(passwordHash);

//     // console.log(req.body); //^=> gives undefined without middleware(as it can't  understand json format)
//     // const userObj = {
//     //   firstName : "Aashish",
//     //   lastName : "Kumar",
//     //   emailId : "aashishk4568@gmail.com",
//     //   password : "aashish@123"
//     // }

//     //creating a new instance of User model
//     // const user = new User(userObj);
//     // const user = new User(req.body); //! this is a bad way

//     const user = new User({
//       firstName, 
//       lastName, 
//       emailId, 
//       password:passwordHash,
//     })

//     await user.save();  //data will be saved to ur database and it returns a promise

//     res.send("User Added successfully");

//   } catch(err) {
//     res.status(400).send("Error:" + err.message);
//   }
// }); 

// //~LOGIN api
// app.post("/login", async(req,res) => {
//   try{
//     const{emailId, password} = req.body;

//     if(!validator.isEmail(emailId))
//     {
//       throw new Error("INVALID emailId");
//     }

//     //whether the user is present or not
//     const user = await User.findOne({emailId: emailId});
//     //user represents that user whose email id is provided

//     if(!user)
//     {
//       // throw new Error("Email id not present in DB") //^=> here, we're exposing important information i.e., which emailid is present in db or not => we should never disclose such things

//       throw new Error("Invalid credentials");
//     }

//     // const isPasswordValid = await bcrypt.compare(password, user.password);
//     //* we can offload password validation to schema itself => user.js, mongoose methods
//     const isPasswordValid = await user.validatePassword(password);

//     if(isPasswordValid)
//     {
//       //& ALL THE LOGIC OF AUTHETICATION / COOKIES

//       //~ Create a JWT token
//         // const token = await jwt.sign({_id : user._id}, "DEV@Tinder$790", { expiresIn: "1d" //* this is for expiring token 
//         //~1d = 1 day
//         // });
//       //& best pratice is to do it using mongoose methods => see user.js

//       const token = await user.getJWT();
//       // console.log(token);

//       //~ Add the token to cookie and send the response back to the user
//       // res.cookie("token", token, {httpOnly:true});

//       res.cookie("token", token, {
//         expires: new Date(Date.now() + 8*3600000), //* this is for expiring cookie
//       });
//       //! while dev=> we work on http => but on production it works on https
//       res.send("Login successful!!");
      
//     }
//     else
//     {
//       // throw new Error("wrong password");//^ => do not leak imp info
//       throw new Error("Invalid credentials");
//     }

//   } catch (err) {
//     res.status(400).send("ERROR : " + err.message);
//   }
// })

// //~ GET profile of the user
// app.get("/profile", userAuth, async(req, res) => { 
    
//   try{
//     // const cookies = req.cookies;

//     // const {token} = cookies;

//     // if(!token)
//     // {
//     //     throw new Error("Invalid Token");
//     // }

//     //Validate my token
    
//     // const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");

//     // console.log(decodedMessage);

//     // const {_id} = decodedMessage;

//     // console.log("Logged in user is : " + _id);

//     // const user = await User.findById(_id);

//     const user = req.user;

//     if(!user)
//     {
//       throw new Error("User does not exist");
//     }

//     // console.log(cookies);//^ undefined => express is not able to read cookie => we need cookieparser

//     // res.send("Reading cookie");
//     res.send(user);
    
//   } catch (err) {
//     res.status(400).send("ERROR : " + err.message);
//   }

// })

// //~ GET user by email
// app.get("/user", async (req,res) => {
//   const userEmail = req.body.emailId;

//   try {

//     const user = await User.find({emailId : userEmail});
//     if(user.length === 0){
//       res.status(404).send("User not found");
//     }
//     else
//     {
//       res.send(user);
//     }

//   }
//   catch(err) {
//     res.status(400).send("Something went wrong");
//   }
// })

// //~ FEED api - GET /feed - get all the users from the database
// app.get("/feed", async (req,res) => {

//   try {

//     const user = await User.find({}); //pass an empty filter
    
//       res.send(user);
     
//   }
//   catch(err) {
//     res.status(400).send("Something went wrong");
//   }
    
// })

// //~ DELETE api
// app.delete("/user", async(req,res) => {

//   const userId = req.body.userId;
  
//   try{
//     const user = await User.findByIdAndDelete(userId);
//     // console.log(user);

//     res.send("User deleted successfully");
//   }
//   catch(err) {
//     res.status(400).send("Something went wrong");
//     console.log(err.message);
//   }
// })

// //~ Update data of the user
// //^ if we try to update a field which is not present in schema => mongoDB will ignore it
// app.patch("/user/:userId", async(req,res) => {
//   const userId = req.params?.userId;
//   const data = req.body;

//   const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

  
//   try{ 
//     const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

//     if(!isUpdateAllowed)
//     {
//       throw new Error("update not allowed");
//     }
//     if(data.skills.length >= 10)
//     {
//       throw new Error("Skills can not be more than 10");
//     }
//     const user = await User.findByIdAndUpdate(userId, data, { 
//       returnDocument: "after",
//       runValidators: true,});
//     res.send("User added successfully"); 
//   }
//   catch(err) {
//     res.status(400).send("UPDATE FAILED :"+ err.message);
//     // console.log(err.message);
//   }
// })

// app.post("/sendConnectionRequest", userAuth, async(req,res) => {

//   const user = req.user;
//   //sending a connection request
//   console.log("Sending a connection request");

//   res.send(user.firstName + " sent the connection request!")
// })

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user")

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB().then(() => {
  console.log("Database connection established....");
  app.listen(3000, () => {
    console.log('server listening on port 3000');
  });
}).catch(err =>{
  console.error("Database can't be connected!!");
});



