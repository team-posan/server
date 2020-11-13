const request = require('supertest')
const app = require('../app')




const dataAdmin = {
    username : 'admin',
    password :'admin'
}

describe('Testing Login Admin Success', ()=>{
    test('Success Login',(done)=>{
        request(app)
        .post('/login')
        .send(dataAdmin)
        .set('Accept', 'application/json')
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
        equest(app)
        .post('/login')
        .send(usernameNotFound)
        .set('Accept', 'application/json')
        .then(response =>{ 
            const { status , body } = response
            expect(status).toBe(404)
            expect(body).toHaveProperty('message', "Email Not Found !")
            done()
        })
    })
    test('Login Password Wrong', (done)=>{
        let passwordWrong = {...dataAdmin, password:'adminsalah'}
        equest(app)
        .post('/login')
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
        equest(app)
        .post('/login')
        .send(usernameEmpty)
        .set('Accept', 'application/json')
        .then(response =>{ 
            const { status , body } = response
            expect(status).toBe(404)
            expect(body).toHaveProperty('message', "Username cannot be empty")
            done()
        })
    })
    test('Login Password Empty', (done)=>{
        let passwordEmpty = {...dataAdmin, username:''}
        equest(app)
        .post('/login')
        .send(passwordEmpty)
        .set('Accept', 'application/json')
        .then(response =>{ 
            const { status , body } = response
            expect(status).toBe(404)
            expect(body).toHaveProperty('message', "Password cannot be empty")
            done()
        })
    })
})