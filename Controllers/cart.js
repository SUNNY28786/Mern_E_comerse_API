  import { Cart } from "../models/Cart.js";
  import {User} from '../models/User.js'

  /// ADD TO CART ++
  // ADD TO CART CONTROLLER FIX
  export const addToCart = async (req, res) => {
    try {
      const { productId, title, price, qty, imgsrc } = req.body;
      const userId = req.user;

      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }

      const quantity = Number(qty);
      const itemPrice = Number(price);

      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId.toString()
      );

      if (itemIndex > -1) {
        // ✅ Only increment quantity (Keep price as Unit Price)
        cart.items[itemIndex].qty += quantity;
      } else {
        cart.items.push({
          productId,
          title,
          price: itemPrice, // Base unit price
          qty: quantity,
          imgsrc,
        });
      }

      await cart.save();
      res.status(201).json({ message: "Item added to cart", cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };

  // DECREASE QTY CONTROLLER FIX
  export const decreaseProducQty = async (req, res) => {
    try {
      const { productId, qty } = req.body;
      const userId = req.user;

      let cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      const quantity = Number(qty);
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId.toString()
      );

      if (itemIndex > -1) {
        const item = cart.items[itemIndex];

        if (item.qty > quantity) {
          // ✅ Simple quantity decrement without floating point math
          item.qty -= quantity;
        } else {
          cart.items.splice(itemIndex, 1);
        }
      } else {
        return res.status(404).json({ message: "Invalid product id" });
      }

      await cart.save();
      return res.status(200).json({ message: "Item quantity decreased", cart });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  };

  //  USER CART
  export const userCart = async (req, res) => {
    try {
      const userId = req.user;

      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({
          message: "Cart not found",
        });
      }

      res.status(200).json({
        message: "User cart",
        cart,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };

  ///  REMOVE PRODUCTFROM CART
  export const removeProductFromCart = async (req, res) => {
    try {
      const userId = req.user;
      const { productId } = req.params;

      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({
          message: "Cart not found",
        });
      }

      const beforeLength = cart.items.length;

      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId.toString()
      );

      if (beforeLength === cart.items.length) {
        return res.status(404).json({
          message: "your card is empty",
        });
      }

      await cart.save();

      return res.status(200).json({
        message: "THIS IS NEW CONTROLLER",
        cart,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: error.message,
      });
    }
  };



  ///  clear CART
  // CLEAR CART
  export const clearCart = async (req, res) => {
    try {
      console.log("🔥 NEW CLEAR CART CONTROLLER");

      const userId = req.user;

      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({
          message: "Cart not found",
        });
      }

      cart.items = [];

      await cart.save();

      return res.status(200).json({
        message: "Cart cleared successfully",
        cart,
      });

    } catch (error) {
      console.error("CLEAR CART ERROR:", error);

      return res.status(500).json({
        message: error.message,
      });
    }
  };
