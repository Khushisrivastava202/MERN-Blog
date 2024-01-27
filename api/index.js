import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "./utils/error.js";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";


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
app.use(cookieParser());


app.use(cors({
    origin: "http://localhost:5173", // Update with your production origin
    credentials: true,
}));


app.get("/", (req, res) => {
    res.json({ message: "API is working" });
});

app.post("/signup", async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || !username.trim() || !email.trim() || !password.trim()) {
        next(errorHandler(400, "All fields are required"));
    }
    //error for pw
    if(password){
        if(password.length<6){
            return next(errorHandler(403,"Password must be at least 6 characters"));
        }
    }
    //errors for username
    if(username){
        if (req.body.username.length < 7 || req.body.username.length >20) {
            return next(errorHandler(400, "Username must be between 7 and 20"));
        }
        if(username.includes(" ")){
            return next(errorHandler(403,"Username cannot contain spaces"));
        }
        if(username !== username.toLowerCase()){
            return next(errorHandler(403,"Username must be in lowercase"));
        }if(!username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(403,"Username must contain letters and numbers"));
        }

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

        const token = jwt.sign({ id: validUser._id ,isAdmin:validUser.isAdmin}, process.env.JWT_SECRET);
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
            const token = jwt.sign({ id: user._id ,isAdmin:user.isAdmin}, process.env.JWT_SECRET);
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
            const token = jwt.sign({ id: newUser._id ,isAdmin:newUser.isAdmin}, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc;
            res.status(200).cookie('access_token', token, { httpOnly: true, }).json(rest);
        }
    }catch(error){
        next(error);
    }
})


app.put('/update/:userId', async (req, res, next) => {
    const token = jwt.sign({ id: req.params.userId }, process.env.JWT_SECRET);
        if (!token) {
            return next(errorHandler(401, 'Unauthorized'));
        }

        jwt.verify(token, process.env.JWT_SECRET,(err,user)=>{
            if(err){
                return next(errorHandler(401, 'Unauthorized'));
            }
            req.user=user;
        });
        // Check if the authenticated user has the privilege to update the specified user
        if (req.user.id !== req.params.userId) {
            return next( errorHandler(403, "You are not allowed to update this user"));
        }

        // Validate and sanitize input
        if (req.body.password) {
            if (req.body.password.length < 6) {
                return next(errorHandler(400, "Password must be at least 6 characters"));
            }
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        if (req.body.username) {
            const usernameRegex = /^[a-zA-Z0-9]+$/;
            if (req.body.username.length < 7 || req.body.username.length > 20 ||
                req.body.username.includes(" ") ||
                req.body.username !== req.body.username.toLowerCase() ||
                !req.body.username.match(usernameRegex)) {
                throw errorHandler(400, "Invalid username");
            }
        }
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    profilePicture: req.body.profilePicture,
                    password: req.body.password,
                }
            }, { new: true });
            const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
        }catch (error) {
            next(error);
        }
});

app.delete('/delete/:userId', async(req,res,next)=>{
    const token = jwt.sign({ id: req.params.userId }, process.env.JWT_SECRET);
    if (!token) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    jwt.verify(token, process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return next(errorHandler(401, 'Unauthorized'));
        }
        req.user=user;
    });

    if (req.user.id !== req.params.userId) {
        return next( errorHandler(403, "You are not allowed to update this user"));
    }
    try{
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User has been deleted');
    }catch(error){
        next(error);
    }
}) 


app.post('/signout', (req,res,next)=>{
    try{
        res.clearCookie('access_token').status(200).json('User as been signed out');
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
