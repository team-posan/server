const route = require('express').Router()
const MidtransController = require('../controllers/midtranscontroller')


route.get('/', MidtransController.getToken )
route.get('/verify', MidtransController.verifyPaymentCart )

// route.get('/failure', MidtransController.failure )

route.post('/verify', MidtransController.checkStatus )


module.exports = route