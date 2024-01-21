import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import User from "./models/user.model.js";
import bcryptjs from "bcryptjs"

  
dotenv.config();



mongoose.connect(process.env.MONGO)
.then( () =>{
    console.log("MongoDB is connected")
}).catch((err) => {
    console.log(err);
})

const app=express();

app.use(express.json());

app.get("/",(req,res)=>{
    res.json({message:'API is working'});
});
 
app.post("/signup", async(req,res)=>{
    const {username,email,password}=req.body;

    if (!username || !email || !password || !username.trim() || !email.trim() || !password.trim()) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const hashedPassword=bcryptjs.hashSync(password,10);
    const newUser = new User({
        username,
        email,
        password:hashedPassword,
    });
    try {
        await newUser.save();
        res.json({ message: "SignUp Successful" });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(3000,  () => {
    console.log("Server is running on port 3000");

});