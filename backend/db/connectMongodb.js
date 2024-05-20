import mongoose from "mongoose";

const connectMongodb = async()=>{
    try {
        const con = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB coonnected:${con.connection.host}`)
        
    } catch (error) {
        console.log(`error connecting to mogodb:${error.message}`);
        process.exit(1);
    }
}

export default connectMongodb ;