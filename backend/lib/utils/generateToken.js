import jwt from 'jsonwebtoken'

export const generateTokenAndSetCookie = (userId,res) =>{
    const token = jwt.sign({userId},process.env.JWT_SCRET,{
        expiresIn:'15d'
    })

    res.cookie("jwt",token,{
        maxAge: 15*24*60*60*1000,
        // httpOnly:true,
        // smaeSite:"strict",
        // secure:process.env.NODE_ENV !=="devlopment",
    })
}