import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
    },
    text:{
            type:String,
    },
    img:{
        type:String,
    },
    likes:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        }
    ],
    comments:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                require:true,
            },
            text:{
                type:String,
                require:true,
            },            
        },
    ],    
},{timestamps:true});

const Post = mongoose.model("Post",postSchema);

export default Post;