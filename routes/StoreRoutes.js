const route = require('express').Router()
const { StoreController } = require('../controllers')


route.get('/', StoreController.getStoreHandler)
route.post('/', StoreController.addStoreHandler)
route.patch('/:id', StoreController.editStoreHandler)
route.delete('/:id', StoreController.deleteStoreHandler)



module.exports = route