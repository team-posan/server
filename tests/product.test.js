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

// let idProduct;

var access_token_admin = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJTdG9yZUlkIjpudWxsLCJpYXQiOjE2MDUyNzczMDl9.OU0cSJOzz3RoawI-pR-K-OJ2II5VzHz-XOPUtD-kIw8"
var access_token_kasir = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsInVzZXJuYW1lIjoia2FzaXJqYWthcnRhIiwicm9sZSI6Imthc2lyIiwiU3RvcmVJZCI6MywiaWF0IjoxNjA1Mjk0NTk3fQ.oemLPkUgoay-5FHqPRdLvvPYR5GPvvnIUpP6npMMxjo"


let productInput = {
          product_name: 'Chiki',
          price: 1000,
          image_url: 'test.jpg',
          stock: 1,
          StoreId: 1,
        //   product_number: ''   // ? tambahan buat barcode product kalau ada
       }

describe('Testing Add Product Success', ()=>{
    test.only('Add Product Success', (done)=>{
        request(app)
         .post('/product')
         .set('access_token', access_token_admin)
         .send(productInput)
         .then(response => {
               const {status, body} = response
               console.log(body)
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
// describe("Product Add data", () => {
// //    let header = {
// //       access_token: tokenAdmin
// //    }

//    let productInput = {
//       product_name: '',
//       price: '',
//       image_url: '',
//       stock: '',
//       storeId: '',
//       product_number: ''   // ? tambahan buat barcode product kalau ada
//    }

//    test.only('Add product', () => {
//       request(app)
//          .post("/product")
//          .set('access_token', access_token_admin)
//          .send(productInput)
//          .then(response => {
//                const {status, body} = response
//                expect(status).toBe(201)
//                expect(body).to.be.an('Object')
//                idProduct = body.id
//                expect(body).toHaveProperty('product_number', expect.any(Number)) // ? ditambah disini
//                expect(body).toHaveProperty('product_name', expect.any(String))
//                expect(body).toHaveProperty('price', expect.any(String))
//                expect(body).toHaveProperty('image_url', expect.any(String))
//                expect(body).toHaveProperty('stock', expect.any(String))
//                expect(body).toHaveProperty('storeId', expect.any(Number))
//                done()
//          })
//    })

//    test("Failed: Add One Data - anAuthorized", done => {
//       request(app)
//           .post('/products')
//           .set('access_token', 'fail-access-token')
//           .send(productInput)
//           .then(response => {
//               const {status, body} = response
//               expect(status).toBe(403)
//               expect(body).toHaveProperty('message', expect.any(String))
//               done()
//           })
//   })
// })

// describe("Product - Admin Case Update Data", () => {
//    // @note Success - Update Data

//    let productUpdateInput = {
//       product_name: '',
//       price: '',
//       image_url: '',
//       stock: '',
//       storeId: ''
//    }

//    test("Success: Edit/Update One Data", done => {
//        request(app)
//            .put('/products/' + idProduct)
//            .set('access_token', access_token)
//            .send(productUpdateInput)
//            .then(response => {
//                const {status, body} = response
//                expect(status).toBe(200)
//                expect(body).toHaveProperty('product_number', expect.any(Number))
//                expect(body).toHaveProperty('product_name', expect.any(String))
//                expect(body).toHaveProperty('price', expect.any(String))
//                expect(body).toHaveProperty('image_url', expect.any(String))
//                expect(body).toHaveProperty('stock', expect.any(String))
//                expect(body).toHaveProperty('storeId', expect.any(Number))
//                done()
//            })
//    })
//    // @note Failed - Update Data
//    test("Failed: Edit/Udate but Price and/or Stock below 0", done => {
//        request(app)
//            .put('/products/' + idProduct)
//            .set('access_token', access_token)
//            .send({
//               ...productUpdateInput,
//               proce: -1,
//               stock: -1
//            })
//            .then(response => {
//                const {status, body} = response
//                expect(status).toBe(400)
//                expect(body).toHaveProperty('message', expect.any(String))
//                done()
//            })
//    })

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
   
//    test("Failed: Edit/Update One Data not found id", done => {
//        request(app)
//          .put('/products/1002')
//          .set('access_token', access_token)
//          .send(productUpdateInput)
//          .then(response => {
//             const {status, body} = response
//             expect(status).toBe(404)
//             expect(body).toHaveProperty('message', 'Not Found!')
//             done()
//          })
//    })
// })