const route = require('express').Router()
const MidtransController = require('../controllers/midtranscontroller')


route.get('/', MidtransController.getToken )
route.get('/verify', MidtransController.verifyPaymentCart )

module.exports = route