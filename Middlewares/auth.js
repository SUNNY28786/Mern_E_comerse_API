import jwt from "jsonwebtoken";
import { User } from "../models/User.js";


export const Authenticated = async (req, res, next) => {
    try {
        const token = req.header("Auth");

        console.log("Token:", token);

        if (!token) {
            return res.status(401).json({
                message: "Login first",
            });
        }

        const decoded = jwt.verify(token, "!@#$%^&*()");
        console.log(decoded);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                message: "User does not exist",
            });
        }

        req.user = user;

        next();

    } catch (err) {
        console.log(err);
        return res.status(401).json({
            message: err.message,
        });
    }
};