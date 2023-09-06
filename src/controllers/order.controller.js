const Order = require("../models/Ordenes");
const Customer = require("../models/User"); // Modelo de cliente
const Product = require("../models/Products"); // Modelo de producto

// Controlador para crear una nueva orden
const createOrder = async (req, res) => {
  const { customerId, productId, quantity } = req.body;

  try {
    // Verificar si el cliente existe
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Verificar si el producto existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Verificar si la cantidad de productos está disponible en el stock
    if (quantity > product.stock) {
      return res
        .status(400)
        .json({ message: "Cantidad insuficiente en el stock" });
    }

    // Si tanto el cliente como el producto existen, proceder a crear la orden
    const order = new Order({
      customer: customerId,
      products: [{ product: productId, quantity }],
      total: product.price * quantity,
    });

    const savedOrder = await order.save();
    // Restar la cantidad del stock del producto
    product.stock -= quantity;
    await product.save();

    if (product.stock <= 0) {
      product.availability = false;
      await product.save();
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    // const orders = await Order.find().select('_id name');
    const orders = await Order.find().populate('customer', 'name email')
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

module.exports =  {createOrder, getOrders}
