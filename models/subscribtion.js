import mongoose from "mongoose";
const subscribtionSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    subscribedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
export default mongoose.model("Subscribtion", subscribtionSchema);