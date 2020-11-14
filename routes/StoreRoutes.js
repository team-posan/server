const route = require('express').Router()
const { StoreController } = require('../controllers')

const { Authentication } = require('../middlewares/Authentication')

route.get('/', StoreController.getStoreHandler)
route.post('/', Authentication ,StoreController.addStoreHandler)
route.patch('/:id', Authentication, StoreController.editStoreHandler)
route.delete('/:id', Authentication, StoreController.deleteStoreHandler)



module.exports = route