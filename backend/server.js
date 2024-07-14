import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import{v2 as cloudinary} from "cloudinary";
import cors from "cors";

import authRoute from './routes/auth.route.js'  // we have to write .js because in package.json we wrote type as module
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import notificationRoute from './routes/notification.route.js'

import connectMongodb from "./db/connectMongodb.js";

dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT

// console.log(process.env.MONGO_URI);
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend origin
    credentials: true, // Enable credentials (cookies)
  }));

app.use(express.json({limit:"5mb"}));  //to parse req.body
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());  // to get the cookie in differnt function like in the protectRoute



app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/posts",postRoute);
app.use("/api/notifications",notificationRoute);



app.listen(PORT,()=>{
    console.log("server started at port 5000");
    connectMongodb();
})