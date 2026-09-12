import { Address } from '../models/Address.js';

export const addAddress = async (req, res) => {

    let { fullName, address, city, state, country, pincode, phonenumber } = req.body
    let userId = req.user;
    let userAddress = await Address.create({
        userId, fullName, address, city, state, country, pincode, phonenumber



    });


    res.json({ message: "Address added", userAddress,sucess:true })

}
export const getAddress = async (req, res) => {
    let address = await Address.find({userId:req.user}).sort({ createdAt:-1 })
    res.json({message:'address',userAddress:address[0]})
}