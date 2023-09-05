const Product = require("../models/Products");

const createProduct = async (req, res) => {
  const { name, description, price, category, imageUrl, stock } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      imageUrl,
      stock,
    });
    const productSaved = await newProduct.save();
    res.status(201).json(productSaved);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: "Producto no existe" });
  }
};

const updateProductById = async (req, res) => {
  try {
    // Verificar si el producto existe
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id,req.body, {new:true} );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message:"No existe el producto" });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
