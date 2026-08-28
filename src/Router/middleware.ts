import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";


dotenv.config();
const ADMIN_KEY= process.env.ADMIN_KEY || "Linux001";

 export const adminMiddleware = (req: Request, res: Response, next: NextFunction)=>{
    const adminkey = req.headers["adminkey"];
    console.log(ADMIN_KEY)

    if (!adminkey || adminkey !== ADMIN_KEY){
        return res.status(401).json({error: "Unauthorized member"})
    }
    next()
}