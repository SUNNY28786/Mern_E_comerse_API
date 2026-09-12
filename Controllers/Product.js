import { Product } from "../models/Product.js";

export const addproduct = async (req, res) => {
  const { title, description, price, category, qty, imgsrc } = req.body;

  try {
    const product = await Product.create({
      title,
      description,
      price,
      category,
      qty,
      imgsrc,
    });

    res.json({
      message: "Product added successfully!",
      product,
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

//// GET PRODUCTS    // TO ALL PRODUCTS SHOW
export const getproducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json({
      message: "All products",
      products,
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};


/// FIND PRODUCT BY ID
export const getproductBYId = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product) {
      return res.json({ message: "Invalid id / product not found" });
    }

    res.json({
      message: "Specific product",
      product,
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

/// UPDATE FROM ID products
export const updateProductById = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      { returnDocument: "after", runValidators: true }
    );

    if (!product) {
      return res.json({ message: "Invalid id / product not found" });
    }

    res.json({
      message: "Product has been updated",
      product,
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

///   DELETE PRODUCT BY ID
export const deleteProductById = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findByIdAndDelete(
      id,
      req.body,
      { returnDocument: "after", runValidators: true }
    );

    if (!product) {
      return res.json({ message: "Invalid id / product not found" });
    }

    res.json({
      message: "Product has been deleted",
      product,
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};