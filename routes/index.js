const route = require('express').Router()

const CartRoute = require('./CartRoutes')
const UserRoute = require('./UserRoutes')
const ProductRoute = require('./ProductRoutes')
const StoreRoute = require('./StoreRoutes')

const { Authentication } = require('../middlewares/Authentication')

route.use('/user', UserRoute)
route.use('/product', Authentication, ProductRoute)
route.use('/cart', CartRoute)
route.use('/store', Authentication , StoreRoute)


module.exports = route