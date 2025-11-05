import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import databaseConnection from "../config/databaseConnection.js";
import authRoutes from "../Routes/authRoutes.js";
import userRoutes from "../Routes/userRoutes.js";
import contactRoutes from "../Routes/contactRoutes.js";
dotenv.config();
const app = express();
const whitelist = [
  //   "https://upstays-frontend.vercel.app",
  "http://localhost:3000",
];
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || whitelist.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

//dataBase Connection
databaseConnection();
//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contact", contactRoutes);

const Port = process.env.PORT || 3001;
app.listen(Port, () => {
  console.log(`server is running on port ${Port}`);
});

export default app;
