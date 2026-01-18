const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/Notebook";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

// const connectToMongo = () =>{
//     mongoose.connect(mongoURI, () =>{
//         console.log("Mongoose Connected Successfully");
//     });
// }

module.exports = connectToMongo;
