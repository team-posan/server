const route = require('express').Router()
const MidtransController = require('../controllers/midtranscontroller')


route.get('/', MidtransController.getToken )

module.exports = route