const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    lastName : {
        type: String,
    },
    emailId : {
        type: String,
        required: true,
        unique: true, //* a unique field gets an index by mongodb itself => no need to manually provide index
        lowercase: true, //whatever case the user enters => it will be stored in lowercase letters only
        trim:true,//mongodb will consider emailid with and without spaces differently => hence, we have to trim the spaces
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error("Invalid Email address");
            }
        }
        
    },
    password: {
        type: String,
        required: true,
        validate(value)
        {
            if(!validator.isStrongPassword (value))
            {
                throw new Error("your pswd is not strong");
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        //~ custom validation function
        validate(value){
            if(!["male", "female", "other", "prefer not to say"].includes(value.toLowerCase())){
                throw new Error(value + " is not a valid gender type");
            }
        } //! BY DEFAULT, validator only works when we are creating a new user and not while updating a user => we'll have to enable it => RUN VALIDATORS IN FINDBYIDANDUPDATE
    },
    photoUrl: {
        type: String,
        default:"https://www.dgvaishnavcollege.edu.in/dummy-profile-pic/",
        validate(value)
        {
            if(!validator.isURL(value)) 
            {
                throw new Error("Invalid url: " + value);
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user"
    },
    skills: {
        type: [String]
    }

}, {timestamps: true});

 //* mongoose method best practice

 //~JWT TOKEN
userSchema.methods.getJWT = async function() { 
    //!never write arrow function here due to use of "this"
    const user = this;

    const token = await jwt.sign({id : user._id}, "DEV@Tinder$790", {
        expiresIn: "7d",
    });

    return token;
}

//~ PASSWORD VALIDATION
userSchema.methods.validatePassword = async function(passwordInputByUser){
    
    const user = this;

    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser, passwordHash
    );

    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = User;