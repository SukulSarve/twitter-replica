import jwt from 'jsonwebtoken'

export const generateTokenAndSetCookie = (userId,res) =>{
    const token = jwt.sign({userId},process.env.JWT_SCRET,{
        expiresIn:'15d'
    })

    console.log("genreateToken : ",token)

    res.cookie("jwt_token",token,{
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
        smaeSite:"none",
        // secure:process.env.NODE_ENV !=="devlopment",
    });

    console.log("cookie : ",res.cookie.jwt_token);
}