import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();

//auth
export const auth = async(req,res,next) =>{
    try {
        let token = req.cookies?.token || req.body?.token;

        const authHeader = req.header("Authorization");
        if(authHeader && authHeader.startsWith("Bearer ")){
            token = authHeader.replace("Bearer ","");
        }

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            });
        }

        try {
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);

            req.user = decode; 
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Token is invalid"
            });
        }
        next()
    } catch (error) {
        return res.status(401).json({
                success:false,
                message:"Something Went Wrong while validating token"
            });
    }
}