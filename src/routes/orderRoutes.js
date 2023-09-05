const express = require('express')
const router = express.Router()
const Order = require('../models/Ordenes')



//Obtener lista de ordenes
router.get('/api/orders', async (req,res)=>{
    try {
        const orders = await Order.find().populate('customer', 'name email')
        res.json(orders)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

//Crear una nueva orden
router.post('/api/orders', async (req,res)=>{
    const orderData = req.body;

    try {
        const newOrder = new Order(orderData)
        const savedOrder = await newOrder.save()
        res.status(201).json(savedOrder)
        
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

module.exports = router;
