import jwt from "jsonwebtoken";
import { compareValidToken } from "../utils/util.js";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = await req.headers.authorization;
        if(authHeader === null || authHeader === undefined) {
            return res.status(401).json({ status: 401, message: "Invalid Token" });
        }

        let token = authHeader.split(" ")[1];
        if(!token || token === null || token === undefined) {
            return res.status(401).json({ status: 401, message: "Invalid Token" });
        }

        // Check Valid Token
        const isTokenValid = await compareValidToken(token);
        if(!isTokenValid) {
            return res.status(401).json({ status: 401, message: "Unauthorized Access" });
        }
        console.log(isTokenValid)
        req.email = isTokenValid.email;
        req.user = isTokenValid;

        next();
    } catch (error) {
        
    }
}

export default authMiddleware