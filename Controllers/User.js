import { User } from "../models/User.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {


        let user = await User.findOne({ email });

        if (user) return res.json({ message: "User Already exist", success: false });

        const hashpass=await bcrypt .hash(password,10)

      user = await User.create({ name, email, password:hashpass});
        res.json({message:"user register sucessfully...!",user,success:true})
    } catch (error) {
        res.json({message:error.message})
    }
}
// USER LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.json({ message: "user not found", success: false });
        }

        const validPassword = await bcrypt.compare(password,user.password);

        if (!validPassword) {
            return res.json({ message: "invalid credentials", success: false });
        }
        const token = jwt.sign({ userId: user._id }, "!@#$%^&*()", {
            expiresIn:"365 days"
        })
        console.log(jwt.verify(token, "!@#$%^&*()"));

        console.log(jwt.verify(token, "!@#$%^&*()"));
        return res.json({
            message: `welcome ${user.name}`,token,success:true,})



    } catch (error) {
        return res.json({ message: error.message });
    }
};


//    GET AL USERS

export const users = async (req, res) => {
    try {
        let users = await User.find().sort({
            createdAt: -1
        });
        res.json(users)
    } catch (errros) {
        res.json(error.message)
    }
}


///  GET USER PROFILE
export const profile = async (req, res) => {
    res.json({user:req.user})

}
