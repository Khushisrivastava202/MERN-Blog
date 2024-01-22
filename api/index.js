import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "./utils/error.js";
import cors from "cors";

dotenv.config();

mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log("MongoDB is connected");
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();

app.use(express.json());

// middleware

app.use((err, req, res, next) => {
    console.error("Error caught by error handling middleware:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.use(cors({
  origin: "http://localhost:5173" // Add your allowed origin here
}));

app.get("/", (req, res) => {
    res.json({ message: "API is working" });
});

app.post("/signup", async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || !username.trim() || !email.trim() || !password.trim()) {
        next(errorHandler(400, "All fields are required"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        res.json({ message: "SignUp Successful" });
    } catch (error) {
        next(error);
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});