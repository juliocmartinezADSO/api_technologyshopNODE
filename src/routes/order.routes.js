const express = require('express')
const router = express.Router()
const {createOrder, getOrders} = require('../controllers/order.controller')
const {verifyToken, isModerator} = require('../middlewares')

//Crear una nueva orden
router.post('/orders', verifyToken, createOrder)

//Obtener lista de ordenes
router.get('/orders', verifyToken, isModerator,  getOrders)


module.exports = router;
