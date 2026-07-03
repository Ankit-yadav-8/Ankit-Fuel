import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Commented out to prevent server crash when MongoDB is not running locally
    // const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`⚠️ MongoDB Connection Skipped (Running without DB)`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // process.exit(1);
  }
};

export default connectDB;
