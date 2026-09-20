import mongoose from 'mongoose';

export const connectDB = async () => {
  const attemptConnect = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
      console.warn(`⏳ Retrying connection in 5 seconds... (Please ensure MongoDB Atlas Network Access allows 0.0.0.0/0)`);
      setTimeout(attemptConnect, 5000);
    }
  };

  attemptConnect();
};
