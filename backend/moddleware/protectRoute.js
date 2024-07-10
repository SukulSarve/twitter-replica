import User from '../models/user.models.js'
import jwt from 'jsonwebtoken'

export const protectRoute=async (req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        console.log("token:",token);
        if(!token){
            return res.status(401).json({error:"Unauthorised: no token provided"});
        }

        const decode = jwt.verify(token,process.env.JWT_SCRET)
        // console.log("decode - "+ decode);
        if(!decode){
            return res.status(401).json({error:"Invalid token"});
        }

        const user = await User.findById(decode.userId).select("-password");
        if(!user){
            return res.status(401).json({error:"User not foud"});
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("error in protectedRoute middleware",error.message);
        res.status(500).json({error:"internal server error"});
    }
}