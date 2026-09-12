    import express from "express";
    import { addToCart, clearCart, decreaseProducQty, removeProductFromCart, userCart } from "../Controllers/cart.js";

    import { Authenticated } from "../Middlewares/auth.js";
    const router = express.Router();

    // Add to cart
    router.post("/add", Authenticated,addToCart);

    // get user cart

    router.get('/user',Authenticated, userCart)


    ///       DELETE ROUTER

    router.delete('/remove/:productId',Authenticated, removeProductFromCart);


    ///clear cart

    router.delete('/clear',Authenticated,clearCart)


    //  decrese cart qty

    router.post('/--qty',Authenticated,decreaseProducQty)

    export default router;
