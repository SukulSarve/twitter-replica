import express from "express";
import authRoute from './routes/auth.route.js'  // we have to write .js because in package.json we wrote type as module

import dotenv from 'dotenv';
import connectMongodb from "./db/connectMongodb.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT

// console.log(process.env.MONGO_URI);

app.use(express.json());  //to parse req.body
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());  // to get the cookie in differnt function like in the protectRoute

app.use("/api/auth",authRoute);



app.listen(PORT,()=>{
    console.log("server started at port 5000");
    connectMongodb();
})