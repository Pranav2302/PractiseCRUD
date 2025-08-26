import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
//import prisma 
import prisma from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

//signup 
export const signup = async (req,res) =>{
    console.log(req.body);

    try {
        const {name,email,password,confirmPassword,address} = req.body;

        //check they exist
        if(!name || !email || !password || !address){
            return res.status(403).json({
                success :false,
                message:"All the fields are required to fill"
            });
        }

        //check name legnth
        if(name.length < 2 || name.length >60){
            return res.status(400).json({
                success:false,
                message:"Name must be in 2 to 60 words"
            });
        }

        //check address length
        if(name.address >200){
            return res.status(400).json({
                success:false,
                message:"Address must be of 200 words"
            });
        }

        //check for email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({
                success:false,
                message:"Provide Valid Email ID"
            });
        }

        //check the regex for password
        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/;
        if(!passwordRegex.test(password)){
            return res.status(400).json({
                success:false,
                message:"Password must be in 8-16 char with atleast one uppercase and special char"
            });
        }

        //password matching
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Both password must be same"
            });
        }

        //check user already exist 
        const existinguser = await prisma.user.findUnique({
            where:{email}
        });

        if(existinguser){
            return res.status(400).json({
                success:false,
                message:"User is Already registered"
            });
        }

        //has the pass
        const hashedPassword = await bcrypt.hash(password,10);
        console.log(hashedPassword);

        //if not create it 
        const user = await prisma.user.create({data:{name,email,password:hashedPassword,address}});
        console.log("User" , user);

        //remove password and send response
        const {password:_,...userResponse} = user;

        return res.status(200).json({
                success:true,
                message:"User is register Successfully",
                data : userResponse,
            });
    } catch (error) { 
        console.log(error);
        if(error.code =='P2002'){
            return res.status(400).json({
                success:false,
                message:"Email already exist",
            });
        }

        return res.status(500).json({
                success:false,
                message:"User Cannot be registered",
            });
    }
}

//login

export const login = async (req,res) =>{
    try {
        const {email , password} = req.body;

        //valid?
        if(!email || !password){
            return res.status(403).json({
                success :false,
                message:"All the fields are required to fill"
            });
        }

        const user = await prisma.user.findUnique({
            where:{email}
        });

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered"
            });
        }

        if(await bcrypt.compare(password,user.password)){
            const payload ={
                email : user.email,
                id:user.id
            };  

        const token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"2h",
        });

        const {password:_,...userResponse} =user;
        userResponse.token = token;

        console.log("Pritinng User" ,userResponse)

        const options ={
            expires : new Date(Date.now() + 1 * 24 * 60 * 60 *1000), //1 day valid
            httpOnly:true,
        };

        //create cookies
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user : userResponse,
            message:"LoggedIn Successfully",
        });
        }else{
            return res.status(401).json({
                success:false,
                message:"Inncorect Password"
            });
        }    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
                success:false,
                message:"Login Failed"
            });
    }
}; 