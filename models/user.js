import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"],
      default: "EMPLOYEE",
    }, 
    isActive: { type: Boolean, default: true }, // لتحديد ما إذا كان المستخدم نشطًا أم لا
    profilePicture: { type: String, default: "" }, // رابط الصورة الشخصية
    bio: { type: String, default: "" }, // سيرة ذاتية قصيرة للمستخدم
    phoneNumber: { type: String, default: "" }, // رقم الهاتف
    address: { type: String, default: "" }, // عنوان المستخدم
    createdAt: { type: Date, default: Date.now }, // تاريخ إنشاء الحساب
    updatedAt: { type: Date, default: Date.now }, // تاريخ آخر تحديث للحساب
    lastLogin: { type: Date, default: Date.now }, // تاريخ آخر تسجيل دخول
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
