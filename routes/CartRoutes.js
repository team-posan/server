const route = require('express').Router()
const { CartController } = require('../controllers')

route.get('/', CartController.getAll)
route.post('/scan', CartController.getAllFromScan)
route.post('/', CartController.addCart)
route.put('/:id', CartController.editCart)
route.patch('/', CartController.setPayment)
route.delete('/:id', CartController.deleteCart)
route.delete('/', CartController.bulkdeleteCart)




module.exports = route