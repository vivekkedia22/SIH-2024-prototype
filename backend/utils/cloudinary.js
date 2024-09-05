import { v2 as cloudinary } from "cloudinary";
import AsyncHandler from "express-async-handler";
import { log } from "console";
import fs from "fs";

import dotenv from "dotenv"
dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary=AsyncHandler(async (localFilePath) =>{
    try {
        console.log(localFilePath);
        console.log("API Key:", process.env.CLOUDINARY_API_KEY);
        if(!localFilePath) return null
        //upload file on cloudinary
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file has been uploaded succesfully
        console.log("File has been uploaded succesfully", response.url);
        fs.unlinkSync(localFilePath);//delete from local folder
        console.log("response from cloudinary",response);
        return response
    } catch (error) {
        console.log("error uploading to cloudinary",error);
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation got failed
    }
})
const deleteOnCloudinary=AsyncHandler(async(oldFileUrl,publicId)=>{
    if(!oldFileUrl){
        throw new Error(400,"File path is required")
    }
    try {
        await cloudinary.uploader.destroy(publicId,{resource_type:`${oldFileUrl.includes("image")? "image" : "video"}`})
    } catch (error) {
        
    }
})


export {uploadOnCloudinary,deleteOnCloudinary} 