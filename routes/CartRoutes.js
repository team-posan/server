const route = require('express').Router()
const { CartController } = require('../controllers')

route.get('/', CartController.getAll)
route.post('/', CartController.addCart)
route.put('/:id', CartController.editCart)
route.patch('/:id', CartController.setPayment)
route.delete('/', CartController.bulkdeleteCart)




module.exports = route