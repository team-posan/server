/**
 * @Customer case
 * @Cassier Case
 * @Admin case
 * 
 * @product case
 * 
 * @Transaction (cart)
    * Add - success fail
    * Delete - success fail
    * Update - success fail
    * Read - success fail
 * 
 */


const request = require("supertest");
const app     = require("../app.js");
const { signToken } = require("../helpers/jwt.js");
const { User } = require('../models')

// let tokenAdmin // di assign di auth user

// describe("Auth Customer", () => {
//    test('Success register ', () => {
//       request(app)
//             .post("/user/register")
//             .send({
//                username: username,
//                phone_number: phone_number
//             })
//             .set("Accept", "aplication/json")
//             .then(response => {
//                 const {status, body} = response
//                 expect(status).toBe(201)
//                 expect(body).toHaveProperty('username', expect.any(String))
//                 expect(body).toHaveProperty('status', expect.any(String))
//                 expect(body).toHaveProperty('phone_number', expect.any(String))
//                 done()
//             })
//    })

//    test('fail register', () => {
//       request(app)
//             .post("/user/register")
//             .send({
//                username: username,
//                phone_number: phone_number
//             })
//             .set("Accept", "aplication/json")
//             .then(response => {
//                 const {status, body} = response
//                 expect(status).toBe(403)
//                 expect(body).toHaveProperty('message', expect.any(String))
//                 done()
//             })
//    })
// })





var access_token_admin
var access_token_kasir
var access
let idProduct;

beforeAll(async (done)=>{
   const admin = await User.findOne({where:{username:'admin'}})
   const kasir = await User.findOne({where:{username:'kasirjakarta'}})
   access_token_admin = signToken({id:admin.id,username:admin.username,role:admin.role,StoreId:admin.StoreId})
   access_token_kasir = signToken({id:kasir.id,username:kasir.username,role:kasir.role,StoreId:kasir.StoreId})
   access = signToken({phone_number:'123456789', role:'customer', id:14})
   done()
})


let productInput = {
          product_name: 'Chiki',
          price: 1000,
          image_url: 'test.jpg',
          stock: 1,
          StoreId: 1,
        //   product_number: ''   // ? tambahan buat barcode product kalau ada
   }




describe('Testing Fetch Product',()=>{
   test('Fetch Product - Admin', (done)=>{
      request(app)
            .get("/product")
            .set("Accept", "application/json")
            .set("access_token", access_token_admin)
            .then((response) => {
                const { status, body } = response;
                expect(status).toBe(200);
                expect(Array.isArray(body)).toBeTruthy();
                done();
            })
   })

   test('Fetch Product - Kasir', (done)=>{
      request(app)
            .get("/product")
            .set("Accept", "application/json")
            .set("access_token", access_token_kasir)
            .then((response) => {
                const { status, body } = response;
                expect(status).toBe(200);
                expect(Array.isArray(body)).toBeTruthy();
                done();
            })
   })

   test('Fetch Product - Customer',(done)=>{
      request(app)
      .get("/product?store=1")
      .set("Accept", "application/json")
      .set("access", access)
      .then((response) => {
          const { status, body } = response;
          expect(status).toBe(200);
          expect(Array.isArray(body)).toBeTruthy();
          done();
      })
   })

   // test('Fetch Product - Failed malformed jwt',(done)=>{
   //    request(app)
   //    .get("/product?store=1")
   //    .set("Accept", "application/json")
   //    .set("access_token", '123')
   //    .then((response) => {
   //        const { status, body } = response;
   //        expect(status).toBe(500);
   //       //  expect(body).toHaveProperty('err', expect.any(String));
   //        done();
   //    })
   // })

})

describe('Testing Add Product', ()=>{
   describe('Testing Add Product Success', ()=>{
      test('Add Product Success', (done)=>{
         request(app)
         .post('/product')
         .set('access_token', access_token_admin)
         .send(productInput)
         .then(response => {
               const {status, body} = response
               expect(status).toBe(201)
            //    expect(body).to.be.an('Object')
               idProduct = body.id
            //    expect(body).toHaveProperty('product_number', expect.any(Number)) // ? ditambah disini
               expect(body).toHaveProperty('product_name', expect.any(String))
               expect(body).toHaveProperty('price', expect.any(Number))
               expect(body).toHaveProperty('image_url', expect.any(String))
               expect(body).toHaveProperty('stock', expect.any(Number))
               expect(body).toHaveProperty('StoreId', expect.any(Number))
               done()
         })
      })
  })
  
  describe('Testing Add Product Failed', ()=>{
     test('Failed Add Product - Unauthorized no token', (done)=>{
        request(app)
         .post('/product')
         //  .set('access_token', 'fail-access-token')
         .send(productInput)
         .then(response => {
               const {status, body} = response
               expect(status).toBe(403)
               expect(body).toHaveProperty('message', expect.any(String))
               done()
         })
     })

     test('Failed Add Product - Unauthorized kasir tried to add', (done)=>{
      request(app)
       .post('/product')
        .set('access_token', access_token_kasir)
       .send(productInput)
       .then(response => {
             const {status, body} = response
             expect(status).toBe(401)
             expect(body).toHaveProperty('message', expect.any(String))
             done()
       })
   })
  })
})


describe('Testing Edit Product', ()=>{
   const productUpdateInput = {...productInput,product_name:'chitato'}
   describe('Testing Edit Product Success', ()=>{
      test("Success: Edit/Update One Data", done => {
         request(app)
            .patch('/product/' + idProduct)
            .set('access_token', access_token_admin)
            .send(productUpdateInput)
            .then(response => {
               const {status, body} = response
               expect(status).toBe(201)
               expect(body).toHaveProperty('message', expect.any(String))
               // expect(body).toHaveProperty('product_number', expect.any(Number))
               // expect(body).toHaveProperty('product_name', expect.any(String))
               // expect(body).toHaveProperty('price', expect.any(String))
               // expect(body).toHaveProperty('image_url', expect.any(String))
               // expect(body).toHaveProperty('stock', expect.any(String))
               // expect(body).toHaveProperty('storeId', expect.any(Number))
               done()
            })
         })
   })

   describe('Testing Edit Product Failed', ()=>{
      test('Failed Edit Product - Unauthorized no token', (done)=>{
         request(app)
         .patch('/product/1')
         //  .set('access_token', 'fail-access-token')
         .send(productUpdateInput)
         .then(response => {
               const {status, body} = response
               expect(status).toBe(403)
               expect(body).toHaveProperty('message', expect.any(String))
               done()
         })
      })

      test('Failed Edit Product - Unauthorized kasir tried to edit product', (done)=>{
         request(app)
         .patch('/product/1')
          .set('access_token', access_token_kasir)
         .send(productUpdateInput)
         .then(response => {
               const {status, body} = response
               expect(status).toBe(401)
               expect(body).toHaveProperty('message', expect.any(String))
               done()
         })
      })

      test('Failed Edit Product - Price or Stock cannot below 0',(done)=>{
         request(app)
           .patch('/product/' + idProduct)
           .set('access_token', access_token_admin)
           .send({
              ...productUpdateInput,
              proce: -1,
              stock: -1
           })
           .then(response => {
               const {status, body} = response
               expect(status).toBe(400)
               expect(body).toHaveProperty('message', expect.any(String))
               done()
           })
      })

      test('Failed Edit Product - Data not found' , (done)=>{
         request(app)
         .patch('/product/1002')
         .set('access_token', access_token_admin)
         .send(productUpdateInput)
         .then(response => {
            const {status, body} = response
            expect(status).toBe(404)
            expect(body).toHaveProperty('message', expect.any(String))
            done()
         })
      })
      
   })
})


describe('Testing Delete Product', ()=>{
   test('Success Delete Product', (done)=>{
      request(app)
      .delete('/product/' + idProduct)
      .set('access_token', access_token_admin)
      .then(response => {
         const {status, body} = response
         expect(status).toBe(201)
         expect(body).toHaveProperty('message', expect.any(String))
         done()
      })
   })

   test('Failed Delete Product - Kasir tried to delete product', (done)=>{
      request(app)
      .delete('/product/' + idProduct)
      .set('access_token', access_token_kasir)
      .then(response => {
         const {status, body} = response
         expect(status).toBe(401)
         expect(body).toHaveProperty('message', expect.any(String))
         done()
      })
   })
  
})
























// describe("Product - Admin Case Update Data", () => {
//    // @note Success - Update Data
//    // @note Failed - Update Data

//    test("Failed: Edit/Update One Data but field input (name, price, stock) set to empty value", done => {
//        request(app)
//            .put('/products/' + idProduct)
//            .set('access_token', access_token)
//            .send({
//                product_name: '',
//                price: '',
//                image_url: '',
//                stock: '',
//                storeId: ''
//            })
//            .then(response => {
//                const {status, body} = response
//                expect(status).toBe(400)
//                expect(body).toHaveProperty('message', expect.any(String))
//                done()
//            })
//    })
   
// })