const request = require('supertest')
const app = require('../app')


let id
let admin_access_token
let customer_access_token

let product = {
    
}



describe('Testing Delete Transaction', ()=>{
    describe('Success Delete data', ()=>{
        test('Delete Successfully with status 200', (done)=>{
            request(app)
            .delete(`/transaction/${id}`)
            .set('access_token', admin_access_token)
            .then(response=>{
                const { status, body } = response
                expect(status).toBe(200)
                expect(body).toHaveProperty('message',`delete transaction id = ${id} successfully`)
                return done()
            })
            .catch(err=>{
                return done(err)
            })
        })
    })

    describe('Fail Delete Transaction', ()=>{
        describe('invalid authentication delete transaction',()=>{
            test('empty access_token', (done)=>{
                request(app)
                .delete(`/transaction/${id}`)
                .then(response=>{
                    const { status , body } = response
                    expect(status).toBe(401)
                    expect(body).toHaveProperty('message', 'need login first')
                    return done()
                })
                .catch(err=>{
                    return done(err)
                })
            }) 
        })

        describe('invalid authorization delete transaction',()=>{
            test('empty access_token', (done)=>{
                request(app)
                .delete(`/transaction/${id}`)
                .set('access_token', admin_access_token)
                .then(response=>{
                    const { status , body } = response
                    expect(status).toBe(401)
                    expect(body).toHaveProperty('message', 'Not Authorized')
                    return done()
                })
                .catch(err=>{
                    return done(err)
                })
            }) 
        })
        
    })
    
})