
import { user as User } from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import getDataUri from "../utils/dataUri.js"
import cloudinary from "../utils/cloudinary.js"


export const register = async (req, res) => {
    try {
        const {firstName,lastName,email,password}=req.body
        if(!firstName || !lastName || !email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill in all fields."})
        }
        if(password.length<6){
            return res.status(400).json({
                success:false,
                message:"Password must be at least 6 characters."})

            }const existingUserByEmail =await User.findOne({email:email});
            if(existingUserByEmail){
                return res.status(400).json({
                    success:false,
                    message:"Email already exists."
                })
            }
            await User.create({
                firstName:firstName,
                lastName:lastName,
                email:email,
                password:bcrypt.hashSync(password,10)
            })
            return res.status(201).json({
                success:true,
                message :"User created successfully."
            })
            const hashedPassword= await bcrypt.hash(password,10);
        }
     
     catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message: 'Internal Server Error : failed to register',
        })
    }
}

export const login= async(req,res)=>{
    try {
        const {email,password}=req.body
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill in all fields."
            })
        }
        const user =await User.findOne({email:email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or password"
            })
        }
        const isValidPassword =await bcrypt.compare(password,user.password);
        if(!isValidPassword){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or password"
            }

            )
        }
        const token = await jwt.sign({userId:user._id},
            process.env.SECRET_KEY, {expiresIn:"1d"}

        )
        return res.status(200).cookie("token",token).json({
           success: true,
  message: `Welcome back ${user.firstName}`,
  token: token,
  user: {
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    photoUrl: user.photoUrl || null, // make sure you include this field
  }
            
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message: 'Internal Server Error : failed to register',
             })
    }
}

export const logout= async(_,res)=>{
    try {
        return res.status(200).clearCookie("token","",{maxAge:0}).json({
            success:true,
            message:"logged out successfully"
        })
    } catch (error) {
        console.log(error)
    }
}


   export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { firstName, lastName, occupation, bio, instagram, facebook, linkedin, github } = req.body;
    const file = req.file;

    let cloudResponse;

    if (file) {
      // Only convert and upload if file exists
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (occupation) user.occupation = occupation;
    if (instagram) user.instagram = instagram;
    if (facebook) user.facebook = facebook;
    if (linkedin) user.linkedin = linkedin;
    if (github) user.github = github;
    if (bio) user.bio = bio;

    if (file && cloudResponse) {
      user.photoUrl = cloudResponse.secure_url;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "failed to update profile",
    });
  }
   }




