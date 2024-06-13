import Notification from "../models/notification.models.js";
import User from "../models/user.models.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({to:userId}).populate({
        path:"from",
        select:"username profileImg"
    });

    await Notification.updateMany({to:userId},{read:true});
    res.status(200).json(notifications);
  } catch (error) {
    console.log("error int the getnotification controller", error.message);
    return res.status(500).json({ error: "error in the internal servevr" });
  }
};

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
    
        await Notification.deleteMany({to:userId});
        res.status(200).json({message:"notifications deleted succesfully "});
      } catch (error) {
        console.log("error int the deletenotification controller", error.message);
        return res.status(500).json({ error: "error in the internal servevr" });
      }
};

// export const deleteOneNotification = async(req,res)=>{
//     try {
//         const notificationsId = req.params.id;
//         const userId = req.user._id;
//         const notification = Notification.findById(notificationsId);
//         if(!notification){
//             return res.status(404).json({message:"notification not found"})
//         }
//         console.log(notification.toString());
//         if(notification.toString() !== userId.toString()){
//             return res.status(403).json({error:"you are not allowed to delete this notification"});
//         }

//         await Notification.findByIdAndDelete(notificationsId);
//         res.status(200).json({message:"notification deleted succesfully"});
//     } catch (error) {
//         console.log("error int the deleteOneNotification controller", error.message);
//         return res.status(500).json({ error: "error in the internal servevr" });
//     }
// }
