const request = require("supertest");
const app     = require("../app.js");
const { signToken } = require("../helpers/jwt.js");
const { User } = require('../models')

const dataAdmin = {
    username : 'admin',
    password :'admin'
}

const dataCustomer = {
    phone_number:'123456789'
}

const newKasir = {
    username:'kasirsurabaya',
    password:'admin',
    role:'kasir',
    StoreId:5
}

const editedKasir = {
    username:'kasirsurabaya2',
}

var idDelete

beforeAll(async (done)=>{
    const admin = await User.findOne({where:{username:'admin'}})
    const kasir = await User.findOne({where:{username:'kasirjakarta'}})
    access_token_admin = signToken({id:admin.id,username:admin.username,role:admin.role,StoreId:admin.StoreId})
    access_token_kasir = signToken({id:kasir.id,username:kasir.username,role:kasir.role,StoreId:kasir.StoreId})
    access = signToken({phone_number:'123456789', role:'customer', id:14})
    console.log('access token kasir', access_token_kasir, kasir)
    done()
 })

describe('Testing Login Admin Success', ()=>{
    test('Success Login',(done)=>{
        console.log('success login', dataAdmin)
        request(app)
        .post('/user/login')
        .send(dataAdmin)
        .then(response =>{ 
            const { status , body } = response
            expect(status).toBe(201)
            expect(body).toHaveProperty('access_token', expect.any(String))
            done()
        })
    })
})


describe('Testing Login Admin Fail', ()=>{
    test('Login Username not found', (done)=>{
        let usernameNotFound = {...dataAdmin, username:'adminsalah'}
        request(app)
        .post('/user/login')
        .send(usernameNotFound)
        .set('Accept', 'application/json')
        .then(response =>{ 
            const { status , body } = response
            expect(status).toBe(404)
            expect(body).toHaveProperty('message', "Username Not Found")
            done()
        })
    })
    test('Login Password Wrong', (done)=>{
        let passwordWrong = {...dataAdmin, password:'adminsalah'}
        request(app)
        .post('/user/login')
        .send(passwordWrong)
        .set('Accept', 'application/json')
        .then(response =>{ 
            const { status , body } = response
            expect(status).toBe(404)
            expect(body).toHaveProperty('message', "Password Wrong")
            done()
        })
    })
    test('Login Username Empty', (done)=>{
        let usernameEmpty = {...dataAdmin, username:''}
        request(app)
        .post('/user/login')
        .send(usernameEmpty)
        .set('Accept', 'application/json')
        .then(response =>{ 
            const { status , body } = response
            expect(status).toBe(404)
            expect(body).toHaveProperty('message', "Username/Password Cannot be empty")
            done()
        })
    })
    test('Login Password Empty', (done)=>{
        let passwordEmpty = {...dataAdmin, username:''}
        request(app)
        .post('/user/login')
        .send(passwordEmpty)
        .set('Accept', 'application/json')
        .then(response =>{ 
            const { status , body } = response
            expect(status).toBe(404)
            expect(body).toHaveProperty('message', "Username/Password Cannot be empty")
            done()
        })
    })
})

describe('Testing Login Customer Success', ()=>{
    test('Success Login Return Customer',(done)=>{
        request(app)
        .post('/user/customerlogin')
        .send(dataCustomer)
        .then(response =>{ 
            const { status , body } = response
            expect(status).toBe(201)
            expect(body).toHaveProperty('access', expect.any(String))
            done()
        })
    })

    test('Success Login New Customer',(done)=>{
        request(app)
        .post('/user/customerlogin')
        .send({...dataCustomer,phone_number:`${Math.floor((Math.random() * 10000000) + 1)}`})
        .then(response =>{ 
            const { status , body } = response
            expect(status).toBe(201)
            expect(body).toHaveProperty('access', expect.any(String))
            done()
        })
    })
})


describe('Testing Admin Add User ( Kasir )', ()=>{
    test('Admin Success Add Kasir', (done)=>{
        request(app)
        .post('/user/addkasir')
        .set('access_token',access_token_admin)
        .send(newKasir)
        .then(response =>{ 
            const { status , body } = response
            expect(status).toBe(201)
            idDelete = body.id
            expect(body).toHaveProperty('id', expect.any(Number))
            expect(body).toHaveProperty('username', expect.any(String))
            expect(body).toHaveProperty('password', expect.any(String))
            expect(body).toHaveProperty('StoreId', expect.any(Number))
            expect(body).toHaveProperty('role', expect.any(String))
            done()
        }) 
    })

    test('Failed Add Kasir - Unauthorized',(done)=>{
        request(app)
        .post('/user/addkasir')
        .set('access_token',access_token_kasir)
        .send(newKasir)
        .then(response =>{ 
            const { status , body } = response
            expect(status).toBe(401)
            expect(body).toHaveProperty('message', expect.any(String))
            done()
        }) 
    })
})


describe('Testing Edit Kasir',()=>{
    test('Success Edit Kasir',(done)=>{
        request(app)
        .patch('/user/editkasir/17')
        .set('access_token',access_token_admin)
        .send(editedKasir)
        .then(response =>{ 
            const { status , body } = response
            expect(status).toBe(201)
            expect(body).toHaveProperty('message', expect.any(String))
            done()
        }) 
    })

    test('Failed Edit Kasir - Unauthorized',(done)=>{
        request(app)
        .patch('/user/editkasir/17')
        .set('access_token',access_token_kasir)
        .send(editedKasir)
        .then(response =>{ 
            const { status , body } = response
            expect(status).toBe(401)
            expect(body).toHaveProperty('message', expect.any(String))
            done()
        }) 
    })
})

describe('Testing Delete Kasir', ()=>{
    test('Success Delete Kasir', (done)=>{
        request(app)
        .delete('/user/deletekasir/' + idDelete)
        .set('access_token',access_token_admin)
        .then(response =>{ 
            const { status , body } = response
            expect(status).toBe(201)
            expect(body).toHaveProperty('message', expect.any(String))
            done()
        }) 
    })

    test('Failed Delete Kasir - Unauthorized', (done)=>{
        request(app)
        .delete('/user/deletekasir/' + idDelete)
        .set('access_token',access_token_kasir)
        .then(response =>{ 
            const { status , body } = response
            expect(status).toBe(401)
            expect(body).toHaveProperty('message', expect.any(String))
            done()
        }) 
    })
})