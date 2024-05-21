import User from '../models/user.models.js'
import bcrypt from 'bcryptjs'
import{generateTokenAndSetCookie} from '../lib/utils/generateToken.js'

export const signup = async (req,res)=>{
    
    try {
        const{fullname,username,email,password} = req.body;
            console.log("email - "+email);

        const emailrgex  =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!emailrgex.test(email)){
            return res.status(400).json({error:"invalid email"});
        }

        const existinguser = await User.findOne({username:username});
        // console.log("username");
        console.log("username - "+username);
        // console.log("existinguser");
        // console.log(existinguser);
        if(existinguser !== null){
            console.log("username is already taken");
            return res.status(400).json({error:"username is already taken"});
        }

        const existingemail = await User.findOne({email}); 
        if(existingemail!==null){
            console.log("email is already taken");
            return res.status(400).json({error:"email is already taken"});
        }

        if(password.length<6){
            return res.status(400).json({error:'password length is less than 6'});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password,salt);

        const newUser= new User({
            fullname,
            username,
            email,
            password:hashedpassword
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                username:newUser.username,
                email:newUser.email,
                password:newUser.password,
                followers:newUser.followers,
                following:newUser.following,
                profileimg:newUser.profileimg,
                coverimg:newUser.coverimg
            })
        }else{
            res.status(400).json({error:"invalid user data"});
        }

    } catch (error) {
        console.log("error in signup controller",error.message)
        res.status(500).json({error:"internal server error"});
    }
}

export const login = async (req,res)=>{
    try {
        const {username,password} = req.body;
        // console.log(username);
        // console.log(password);
        const user = await User.findOne({username});
        // console.log(user.username);
        const isPasswordValid = await bcrypt.compare(password,user?.password||"");
        // console.log(isPasswordValid);
        if(!user || !isPasswordValid){
            return res.status(400).json({error:"Invalid username or password"});
        }

        generateTokenAndSetCookie(user._id,res);
        res.status(201).json({
            _id:user._id,
            fullname:user.fullname,
            username:user.username,
            email:user.email,
            password:user.password,
            followers:user.followers,
            following:user.following,
            profileimg:user.profileimg,
            coverimg:user.coverimg
        });
        
    } catch (error) {
        console.log("error in signup controller",error.message)
        res.status(500).json({error:"internal server error"});
    }
}

export const logout = async (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"succesfully looged out"})
    } catch (error) {
        console.log("error in signup controller",error.message);
        res.status(500).json({error:"internal server error"});
    }
}
  
export const getme = async(req,res)=>{
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json(user);
    } catch (error) {
        console.log("error in getme controller",error.message);
        res.status(500).json({error:"internal server error"});
    }
}