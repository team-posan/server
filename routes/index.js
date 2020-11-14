const route = require('express').Router()

const CartRoute = require('./CartRoutes')
const UserRoute = require('./UserRoutes')
const ProductRoute = require('./ProductRoutes')
const StoreRoute = require('./StoreRoutes')

const { Authentication } = require('../middlewares/Authentication')
const { AuthenticationCart } = require('../middlewares/AuthenticationCart')

route.use('/user', UserRoute)
route.use('/product', Authentication, ProductRoute)
route.use('/store', StoreRoute)
route.use('/carts', Authentication, CartRoute)

module.exports = route