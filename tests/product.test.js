/**
 * @Customer case
 * @Cassier Case
 * @Admin case
 * 
 * @product
 * 
 */


const { signToken } = require('../helpers/jwt')
const request = require("supertest");
const app     = require("../app.js");
let tokenAdmin // di assign di auth user

let idProduct;

// * Access token Dari sini
beforeAll (done => {
    User.findOne({
        where: {
            email: 'admin@mail.com'
        }
    }).then (result => {
        access_token = signToken(result.id, result.email, result.role);
        done()
    })
}, 5000)

let productInput = {
    product_name: '',
    price: '',
    image_url: '',
    stock: '',
    storeId: '',
    product_number: ''   // ? tambahan buat barcode product kalau ada
 }

describe("Product Add data", () => {
   let header = {
      access_token: tokenAdmin
   }

   test('Add product', () => {
      request(app)
         .post("/products")
         .set('access_token', access_token)
         .send(productInput)
         .then(response => {
               const {status, body} = response
               expect(status).toBe(201)
               expect(body).to.be.an('Object')
               idProduct = body.id
               expect(body).toHaveProperty('product_number', expect.any(Number)) // ? ditambah disini
               expect(body).toHaveProperty('product_name', expect.any(String))
               expect(body).toHaveProperty('price', expect.any(String))
               expect(body).toHaveProperty('image_url', expect.any(String))
               expect(body).toHaveProperty('stock', expect.any(String))
               expect(body).toHaveProperty('storeId', expect.any(Number))
               done()
         })
   })

   test("Failed: Add One Data - anAuthorized", done => {
      request(app)
          .post('/products')
          .set('access_token', 'fail-access-token')
          .send(productInput)
          .then(response => {
              const {status, body} = response
              expect(status).toBe(403)
              expect(body).toHaveProperty('message', expect.any(String))
              done()
          })
  })
})

describe("Product - Admin and User Case Fetch", () => {
    // @note Success - Fetch All Data
    test("Success: Fetch All Data Product", done => {
        request(app)
            .get('/products')
            .set('access_token', access_token)
            .then(response => {
                const {status, body} = response
                expect(status).toBe(200)
                expect(body[0]).toHaveProperty('product_number', expect.any(Number)) // ? ditambah disini
                expect(body[0]).toHaveProperty('product_name', expect.any(String))
                expect(body[0]).toHaveProperty('price', expect.any(String))
                expect(body[0]).toHaveProperty('image_url', expect.any(String))
                expect(body[0]).toHaveProperty('stock', expect.any(String))
                expect(body[0]).toHaveProperty('storeId', expect.any(Number))
                done()
            })
    })
    // @note Success - Fetch One Data
    test("Success: Fetch One Data", done => {
        request(app)
            .get('/products/' + idProduct)
            .set('access_token', access_token)
            .then(response => {
                const {status, body} = response
                expect(status).toBe(200)
                expect(body).toHaveProperty('product_number', expect.any(Number)) // ? ditambah disini
                expect(body).toHaveProperty('product_name', expect.any(String))
                expect(body).toHaveProperty('price', expect.any(String))
                expect(body).toHaveProperty('image_url', expect.any(String))
                expect(body).toHaveProperty('stock', expect.any(String))
                expect(body).toHaveProperty('storeId', expect.any(Number))
                done()
            })
    })
    // @note Failed - Fetch All Data
    test('Failed: Fetch All Data but not Authorized', done => {
        request(app)
            .get('/products')
            .set('access_token', 'not_real_access_token')
            .then(response => {
                const {status, body} = response
                expect(status).toBe(401)
                expect(body).toHaveProperty('message', 'You dont have acces to this operation')

                done()
            })
    })
    // @note Failed - Fetch One Data
    test('Failed: Fetch One Data but not Authorized', done => {
        request(app)
            .get('/products/1')
            .set('access_token', 'not_real_access_token')
            .then(response => {
                const {status, body} = response
                expect(status).toBe(401)
                expect(body).toHaveProperty('message', 'You dont have acces to this operation')

                done()
            })
    })
    test('Failed: Fetch One Data but product not found', done => {
        request(app)
            .get('/products/1002')
            .set('access_token', access_token)
            .then(response => {
                const {status, body} = response
                expect(status).toBe(404)
                expect(body).toHaveProperty('message', 'Not Found!')

                done()
            })
    })
})


describe("Product - Admin Case Update Data", () => {
   // @note Success - Update Data

   test("Success: Edit/Update One Data", done => {
       request(app)
           .put('/products/' + idProduct)
           .set('access_token', access_token)
           .send(productUpdateInput)
           .then(response => {
               const {status, body} = response
               expect(status).toBe(200)
               expect(body).toHaveProperty('product_number', expect.any(Number))
               expect(body).toHaveProperty('product_name', expect.any(String))
               expect(body).toHaveProperty('price', expect.any(String))
               expect(body).toHaveProperty('image_url', expect.any(String))
               expect(body).toHaveProperty('stock', expect.any(String))
               expect(body).toHaveProperty('storeId', expect.any(Number))
               done()
           })
   })
   // @note Failed - Update Data
   test("Failed: Edit/Udate but Price and/or Stock below 0", done => {
       request(app)
           .put('/products/' + idProduct)
           .set('access_token', access_token)
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

   test("Failed: Edit/Update One Data but field input (product_name, price, stock) set to empty value", done => {
       request(app)
           .put('/products/' + idProduct)
           .set('access_token', access_token)
           .send({
               product_name: '',
               price: '',
               image_url: '',
               stock: '',
               storeId: ''
           })
           .then(response => {
               const {status, body} = response
               expect(status).toBe(400)
               expect(body).toHaveProperty('message', expect.any(String))
               done()
           })
   })
   
   test("Failed: Edit/Update One Data not found id", done => {
       request(app)
         .put('/products/1002')
         .set('access_token', access_token)
         .send(productUpdateInput)
         .then(response => {
            const {status, body} = response
            expect(status).toBe(404)
            expect(body).toHaveProperty('message', 'Not Found!')
            done()
         })
   })
})


describe("Product - Admin Case Delete Data", () => {
    // @note Success - Delete Data
    test("Success: Delete One Data", done => {
        request(app)
            .delete('/products/' + idProduct)
            .set('access_token', access_token)
            .then(response => {
                const {status, body} = response
                expect(status).toBe(200)
                expect(body).toHaveProperty('message', 'Product: success deleted')

                done()
            })
    })
    // @note Failed - Delete Data
    test("Failed: Delete One Data but role didn't have authorization", done => {
        request(app)
            .delete('/products/' + idProduct)
            .set('access_token', 'wr0n6_acc33ss_t0k3n')
            .then(response => {
                const {status, body} = response
                expect(status).toBe(401)
                expect(body).toHaveProperty('message', 'You dont have acces to this operation')

                done()
            })
    })
    test("Failed: Delete One Data but Data Not Found", done => {
        request(app)
            .delete('/products/1002')
            .set('access_token', access_token)
            .then(response => {
                const {status, body} = response
                expect(status).toBe(404)
                expect(body).toHaveProperty('message', 'Not Found!')

                done()
            })
    })
})

// * @remind Untuk Memnbersihkan semua data di table database setelah test selesai
afterAll(done => {
    queryInterface.bulkDelete('Products', null, {});
    done()
})