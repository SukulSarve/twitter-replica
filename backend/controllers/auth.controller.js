import User from '../models/user.models.js'
import bcrypt from 'bcryptjs'
import{generateTokenAndSetCookie} from '../lib/utils/generateToken.js'

export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;
        
        // Log the request body to debug
        console.log("Request Body:", req.body);

        if (!fullName) {
            return res.status(400).json({ error: "Fullname is required" });
        }

        // Email validation
        const emailrgex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailrgex.test(email)) {
            return res.status(400).json({ error: "Invalid email" });
        }

        // Check if username already exists
        const existinguser = await User.findOne({ username: username });
        if (existinguser !== null) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        // Check if email already exists
        const existingemail = await User.findOne({ email });
        if (existingemail !== null) {
            return res.status(400).json({ error: "Email is already taken" });
        }

        // Password length validation
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password length is less than 6' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedpassword
        });

        // Save user to the database and respond
        await newUser.save();

        generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileimg: newUser.profileimg,
            coverimg: newUser.coverimg
        });
    } catch (error) {
        console.log("Error in signup controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const login = async (req,res)=>{
    try {
        const {username,password} = req.body;
        // console.log(username);
        // console.log(password);
        const user = await User.findOne({username:username});
        // console.log(user.username);
        const isPasswordValid = await bcrypt.compare(password,user?.password||"");
        // console.log(isPasswordValid);
        if(!user ){
            return res.status(400).json({error:"Invalid username"});
        }
        if(!isPasswordValid){
            return res.status(400).json({error:"Invalid password"});
        }
        

        generateTokenAndSetCookie(user._id,res);
        console.log("adsfsdf", req.cookies.jwt_token);
        res.status(201).json({
            _id:user._id,
            fullName:user.fullName,
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
        res.cookie("jwt_token","",{maxAge:0});
        res.status(200).json({message:"succesfully looged out"})
    } catch (error) {
        console.log("error in signup controller",error.message);
        res.status(500).json({error:"internal server error"});
    }
}
  
export const getme = async(req,res)=>{
    try {
        const user = await User.findById(req.user._id);
        console.log(user);
        res.status(200).json(user);
    } catch (error) {
        console.log("error in getme controller",error.message);
        res.status(500).json({error:"internal server error"});
    }
}