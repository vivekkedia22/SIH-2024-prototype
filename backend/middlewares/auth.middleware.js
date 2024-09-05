import asynchandler from "express-async-handler"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

const verifyLoggedIn=asynchandler(async(req,res,next)=>{
    let token;
    // console.log("hahaa herre in authUser");
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")
    ){
        try{
            token=req.headers.authorization.split(" ")[1];

            //decoded token id
            const decoded=jwt.verify(token,process.env.JWT_SECRET);

            req.user=await User.findById(decoded.id).select("-password");

            next();
        }catch(err){
            res.status(401);
            console.log(err);
            throw new Error("NOt authorized,token failed", err);
        }
    }
    if(!token){
        res.status(401)
        throw new Error("Not authorized , no token ")
    }
})

export {verifyLoggedIn}