const route = require('express').Router()
const { ProductController } = require('../controllers')


route.get('/', ProductController.getProductHandler)
route.post('/', ProductController.addProductHandler)
route.patch('/:id', ProductController.editProductHandler)
route.delete('/:id', ProductController.deleteProductHandler)





module.exports = route