const request = require('supertest')
const app = require('../app')




const dataAdmin = {
    username : 'admin',
    password :'admin'
}

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