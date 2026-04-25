import mongoose from "mongoose";

export async function connect() {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("Already connected to MongoDB");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;

    connection.on('connected', () => {
      console.log("MongoDB connected successfully!");
    });

    connection.on('error', (err) => {
      console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
      process.exit();
    });
  } catch (error) {
    console.log("Something went wrong!");
    console.log(error);
  }
}