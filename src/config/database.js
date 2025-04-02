const mongoose = require("mongoose");

const connectDB = async() => {
    await mongoose.connect(
        "mongodb+srv://aashishk4568:vXDWk9nmhtyOpTKN@devtinder.nhgv07a.mongodb.net/?retryWrites=true&w=majority&appName=devTinder",
        // {
        //     // useUnifiedTopology: true,
        //     // useNewUrlParser: true,
        //     // useCreateIndex: true, //make this true
        //     // autoIndex: true, //make this also true
        // }
    );
};

module.exports = connectDB;



