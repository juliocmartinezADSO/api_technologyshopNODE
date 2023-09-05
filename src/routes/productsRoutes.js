const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} = require("../controllers/products.controller");

const {verifyToken, isModerator, isAdmin} = require('../middlewares/')
// Crear un nuevo producto
router.post("/api/products", [verifyToken, isModerator], createProduct);

// Obtener lista de productos
router.get("/api/products", getProducts);

// Obtener detalles de un producto
router.get("/api/products/:id", getProductById);

// Actualizar un producto por ID
router.put("/api/products/:id", [verifyToken, isAdmin], updateProductById);

// Eliminar un producto por ID
router.delete("/api/products/:id", [verifyToken, isModerator], deleteProductById);

module.exports = router;
