import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "./utils/error.js";
import cors from "cors";
import jwt from "jsonwebtoken";

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


app.use(cors({
  origin: "http://localhost:5173" 
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

app.post("/signin", async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
        next(errorHandler(400, "All fields are required"));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(400, "User not found"));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, "Invalid Password"));
        }

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        res.status(200).cookie('access_token', token, { httpOnly: true, }).json(rest);
    } catch (error) {
        next(error);
    }
});


app.post("/google",async (req,res,next)=>{
    const {email,name,googlePhotoUrl}=req.body;
    try{
        const user=await User.findOne({email});
        if(user){
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            res.status(200).cookie('access_token', token, { httpOnly: true, }).json(rest);
        }
        else{//as pass is req field we have to genrate a random password
            const genrateedPassword=Math.random().toString(36).slice(-8);
            const hashedPassword=bcryptjs.hashSync(genrateedPassword,10);
            const newUser=new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password:hashedPassword,
                profilePicture:googlePhotoUrl,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc;
            res.status(200).cookie('access_token', token, { httpOnly: true, }).json(rest);
        }
    }catch(error){
        next(error);
    }
})


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});





// middleware

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });
