import User from "../models/user.js";
import Session from "../models/session.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function registerUser(req, res) {
  const {
    username,
    email,
    password,
    role,
    isActive,
    profilePicture,
    bio,
    phoneNumber,
    address,
  } = req.body;

  try {
    if (await User.exists({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      isActive,
      profilePicture,
      bio,
      phoneNumber,
      address,
      lastLogin: new Date(),
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({
      message: "User registration failed",
      error: error.message,
    });
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const loginUser = await User.findOne({ email });
    if (!loginUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, loginUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: loginUser._id, role: loginUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🟢 إنشاء Session جديدة
    await Session.create({
      userId: loginUser._id,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      isActive: true,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".vercel.app",
      maxAge: 3600000,
    });

    loginUser.lastLogin = new Date();
    await loginUser.save();

    res.status(200).json({
      message: "User logged in successfully",
      user: loginUser,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "User login failed",
      error: error.message,
    });
  }
}

export async function logoutUser(req, res) {
  try {
    let authHeader = req.headers["authorization"] || req.headers["Authorization"];
  let token = authHeader && authHeader.split(" ")[1];

    if (token) {
      await Session.findOneAndDelete({ token });
    }

    res.clearCookie("token", {
      secure: true,
      sameSite: "none",
      domain: ".vercel.app",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Logout failed",
      error: error.message,
    });
  }
}
