const route = require('express').Router()
const { UserController } = require('../controllers')
const { Authentication } = require('../middlewares/Authentication')


route.post('/customerlogin', UserController.customerLoginHandler)
route.post('/login', UserController.adminLoginHandler)

route.get('/getkasir', Authentication, UserController.getKasirHandler)
route.post('/addkasir',Authentication, UserController.addKasirHandler)
route.patch('/editkasir/:id',Authentication, UserController.editKasirHandler)
route.delete('/deletekasir/:id',Authentication, UserController.deleteKasirHandler)



module.exports = route