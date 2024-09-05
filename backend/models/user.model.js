import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        requierd:true
    },
    avatar:{
        type:String,
        required:true,
        default:"https://i.pinimg.com/474x/f5/6b/ae/f56baef86aed6c261c422402aab59065.jpg"
    },
    googleId:{
        type:String
    }
},{
    timestamps:true
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))  return next();
    this.password=await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.matchPassword=async function(password){
    return await bcrypt.compare(password,this.password)
}
export const User=mongoose.model("User",userSchema);