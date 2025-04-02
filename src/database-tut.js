// const { MongoClient } = require("mongodb");

// const url =
//  "mongodb+srv://aashishk4568:alfYH0K8iz0cyCpc@firstcluster.n6x2w.mongodb.net/";

// const client = new MongoClient(url);

// const dbName = "HelloWorld"

// async function main() {
//     await client.connect();
//     console.log("Connected successfully to server");
//     const db = client.db(dbName);
//     const collection = db.collection("User");

//     //insert data
//     const data = {
//         firstName : "ankit",
//         lastName : "Kumar",
//         city : "Delhi"
//     }

//     const insertResult = await collection.insertMany([data]);
//     console.log("INSERTED DOCUMENTS =>", insertResult);

//     //read data
//     const findResult = await collection.find({}).toArray();
//     console.log("found Documents =>", findResult);

//     return "done."
    
// }

// main()
//     .then(console.log)
//     .catch(console.error)
//     .finally(() => client.close());

// // alfYH0K8iz0cyCpc  