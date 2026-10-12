import mongoose from "mongoose"
import { configDotenv } from "dotenv"

configDotenv()

export const dbConnection = async () => {
  try {
   await mongoose.connect(process.env.MONGO_URI);
   console.log("🚀 Successfully connected to MongoDB");
  } catch(err){
    console.log("Failed 🤬 to connect to the MongoDB", err.message);
  }
}