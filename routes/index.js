const route = require('express').Router()

const CartRoute = require('./CartRoutes')
const UserRoute = require('./UserRoutes')
const ProductRoute = require('./ProductRoutes')

route.use('/user', UserRoute)
route.use('/product', ProductRoute)
route.use('/cart', CartRoute)


module.exports = route