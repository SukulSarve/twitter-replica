import bcrypt from 'bcryptjs'
import{v2 as cloudinary} from "cloudinary";


import Notification from "../models/notification.models.js";
import User from "../models/user.models.js";

export const getUserProfile = async (req,res)=>{
    try {
        const{username} = req.params;
        const user = await User.findOne({username}).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(" error in getUserProfile - "+error);
        return res.status(500).json({error:error.message});
    }
}

export const followUnfollowUser = async(req,res)=>{
    try {
        
        const {id} = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id === req.user._id.toString()){
            return res.status(400).json({error:"You can't follow/unfollow yourself"});
        }

        if(!userToModify || !currentUser){
            return res.status(400).json({error:"user not found"});
        }

        const isFollowing = currentUser.following.includes(id);
        if(isFollowing){
            await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}});
            // send the notification
            // const newNotification = new Notification({
            //     type:"Unfollow",
            //     from:req.user._id,
            //     to:userToModify._id,
            // })

            // await newNotification.save();
            res.status(200).json({message:"user unfollowed succesfully"});
        }else{
            await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$push:{following:id}});
            //send the notifiacation
            const newNotification = new Notification({
                type:"follow",
                from:req.user._id,
                to:userToModify._id,
            })

            await newNotification.save();
            // TODO: return the id of the user to response
            res.status(200).json({message:"user followed succesfully"});

        }
        
    } catch (error) {
        console.log(" error in followUnfollowUser - "+error);
        return res.status(500).json({error:error.message});        
    }
}

export const getSuggestedProfile = async (req,res)=>{
    try {
        const userId = req.user._id;
        console.log(userId);
        const userFollowedByMe = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match:{
                    _id:{$ne:userId}
                }
            },
            {$sample:{size:10}}
        ])

        const filteredUsers = users.filter(user=>!userFollowedByMe.following.includes(user._id));
        const suggesstedUser = filteredUsers.slice(0,4);

        suggesstedUser.forEach(user=>user.password = null);

        res.status(200).json(suggesstedUser);
    } catch (error) {
        console.log(" error in getSuggestedProfile - "+error);
        return res.status(500).json({error:error.message}); 
    }
}

export const updateUser = async (req,res)=>{
    const{fullname,username,email,currentPassword,newPassword,bio,link} = req.body;
    let{profileimg,coverimg} = req.body;
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);

        if(!user) return res.status(404).json({error:"User not found"});

        if((!currentPassword && newPassword)||(!newPassword && currentPassword)){
            return res.status(404).json({error:"Please provide both currunt and new password"});
        }

        if(currentPassword && newPassword){
        const isMatch = await bcrypt.compare(currentPassword,user.password);
        if(!isMatch) return res.status(400).json({error:"Current password is incoorect"});
        if(newPassword.length<6) return res.status(404).json({error:'password length should be grater than 6'});

        let salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword,salt);
        }

        if(profileimg){
            if(user.profileimg){
                await cloudinary.uploader.destroy(user.profileimg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileimg);
            profileimg = uploadedResponse;
        }

        if(coverimg){
            if(user.coverimg){
                await cloudinary.uploader.destroy(user.coverimg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverimg);
            coverimg = uploadedResponse;
        }

        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.username = username ||  user.username;
        user.bio = bio || user.bio;
        user.link = link|| user.link;
        user.profileimg = profileimg|| user.profileimg;
        user.coverimg = coverimg || user.coverimg;

        user = await user.save();

        // user.password = null ;  // this will not update the datab as we are not writing the await user.save after that;

        return res.status(200).json(user);
        
    } catch (error) {
        console.log(" error in updateUser - "+error);
        return res.status(500).json({error:error.message}); 
    }
}