const request = require("supertest");
const app = require("../app.js");
const { signToken } = require("../helpers/jwt.js");
const { User } = require('../models')



var access_token_admin
var access_token_kasir
var access
var idStore

var inputStore = {
   store_name:'surabaya',
   store_address:'surabaya raya no99'
}


beforeAll(async (done)=>{
   const admin = await User.findOne({where:{username:'admin'}})
   const kasir = await User.findOne({where:{username:'kasirjakarta'}})
   access_token_admin = signToken({id:admin.id,username:admin.username,role:admin.role,StoreId:admin.StoreId})
   access_token_kasir = signToken({id:kasir.id,username:kasir.username,role:kasir.role,StoreId:kasir.StoreId})
   access = signToken({phone_number:'123456789', role:'customer', id:14})
   done()
})


describe('Testing Fetch Store',()=>{
   test('Fetch Store', (done)=>{
      request(app)
            .get("/store")
            .then((response) => {
                const { status, body } = response;
                expect(status).toBe(200);
                expect(Array.isArray(body)).toBeTruthy();
                done();
            })
   })

})

describe('Testing Add Store', ()=>{
   describe('Testing Add Store Success', ()=>{
      test('Add Store Success', (done)=>{
         request(app)
         .post('/store')
         .set('access_token', access_token_admin)
         .send(inputStore)
         .then(response => {
               const {status, body} = response
               expect(status).toBe(201)
            //    expect(body).to.be.an('Object')
               idStore = body.id
               expect(body).toHaveProperty('store_name', expect.any(String))
               expect(body).toHaveProperty('store_address', expect.any(String))
               done()
         })
      })
  })
  
  describe('Testing Add Store Failed', ()=>{
     test('Failed Add Store - Unauthorized no token', (done)=>{
        request(app)
         .post('/store')
         //  .set('access_token', 'fail-access-token')
         .send(inputStore)
         .then(response => {
               const {status, body} = response
               expect(status).toBe(404)
               expect(body).toHaveProperty('message', expect.any(String))
               done()
         })
     })
   })

     test('Failed Add Store - Unauthorized kasir tried to add', (done)=>{
      request(app)
       .post('/store')
        .set('access_token', access_token_kasir)
       .send(inputStore)
       .then(response => {
             const {status, body} = response
             expect(status).toBe(401)
             expect(body).toHaveProperty('message', expect.any(String))
             done()
       })
   })
})

describe('Testing Edit Product', ()=>{
   const storeUpdateInput = {...inputStore,store_name:'surabaya 3'}
   describe('Testing Edit Store Success', ()=>{
      test("Success: Edit/Update One Data", done => {
         request(app)
            .patch('/store/' + idStore)
            .set('access_token', access_token_admin)
            .send(storeUpdateInput)
            .then(response => {
               const {status, body} = response
               expect(status).toBe(201)
               console.log(body)
               expect(body).toHaveProperty('message', expect.any(String))
               expect(body).toHaveProperty('updateStore', expect.any(Array))
               done()
            })
         })
   })

   describe('Testing Edit Store Failed', ()=>{
      test('Failed Edit Store - Unauthorized no token', (done)=>{
         request(app)
         .patch('/store/' +idStore)
         //  .set('access_token', 'fail-access-token')
         .send(storeUpdateInput)
         .then(response => {
               const {status, body} = response
               expect(status).toBe(404)
               expect(body).toHaveProperty('message', expect.any(String))
               done()
         })
      })

      test('Failed Edit Store - Unauthorized kasir tried to edit store', (done)=>{
         request(app)
         .patch('/store/' + idStore)
          .set('access_token', access_token_kasir)
         .send(storeUpdateInput)
         .then(response => {
               const {status, body} = response
               console.log(body)
               expect(status).toBe(401)
               expect(body).toHaveProperty('message', expect.any(String))
               done()
         })
      })
   })
})

describe('Testing Delete Store', ()=>{
   test('Success Delete Store', (done)=>{
      request(app)
      .delete('/store/' + idStore)
      .set('access_token', access_token_admin)
      .then(response => {
         const {status, body} = response
         expect(status).toBe(201)
         expect(body).toHaveProperty('message', expect.any(String))
         done()
      })
   })

   test('Failed Delete Store - Kasir tried to delete product', (done)=>{
      request(app)
      .delete('/store/' + idStore)
      .set('access_token', access_token_kasir)
      .then(response => {
         const {status, body} = response
         expect(status).toBe(401)
         expect(body).toHaveProperty('message', expect.any(String))
         done()
      })
   })
  
})