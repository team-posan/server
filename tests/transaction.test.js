const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const { signToken } = require("../helpers/jwt.js");
const { User } = require('../models')

// let id = 1;
// var access_token_admin
// var access_token_kasir
// var access
let id
let id2
let id3
var access_token_customer
let access_token_kasir

beforeAll(async (done)=>{
  const customer = await User.findOne({where:{phone_number:'123456789'}})
  const kasir = await User.findOne({where:{username:'kasirjakarta'}})
  access_token_customer = signToken({id:customer.id,role:customer.role, phone_number: customer.phone_number})
  access_token_kasir = signToken({id:kasir.id,username:kasir.username,role:kasir.role,StoreId:kasir.StoreId})
//   access = signToken({phone_number:'123456789', role:'customer', id:14})
//   console.log('akses token', access_token_customer, access_token_kasir)
  done()
})


let inputCartsSuccess = {
  ProductId: 1,
  quantity: 20,
  payment_status: "unpayment",
};

let inputCartsFailed = {
  ProductId: null,
  UserId: "1",
  quantity: -1,
  payment_status: "unpayment",
};

// CREATE
describe("test POST carts", () => {
  test("success test post carts", (done) => {
    request(app)
      .post("/carts")
      .send({
        carts: [inputCartsSuccess, inputCartsSuccess, inputCartsSuccess]
      })
      .set("Accept", "application/json")
//       .set("access", access)
      .set("access", access_token_customer)
      .then((response) => {
        const { status, body } = response;
        id = body[0].id
        id2 = body[1].id
        id3 = body[2].id
        console.log('>>>>> id baru', id, id2);
        expect(status).toBe(201);
        expect(body[0]).toHaveProperty("ProductId", expect.any(Number));
        // expect(body[0]).toHaveProperty("UserId", expect.any(Number)); // harunya return number dari db
        expect(body[0]).toHaveProperty("quantity", expect.any(Number));
        expect(body[0]).toHaveProperty("payment_status", expect.any(String));
        done();
      })
      // .catch(err=>{
      //   console.log(err)
      //   done()
      // })
  });

  test(`failed test post carts invalid access token `, (done) => {
    request(app)
      .post("/carts")
      .send(inputCartsSuccess)
      .set("NotAccept", "application/json")
      .then((response) => {
        const { status, body } = response;
        console.log(body)
        expect(status).toBe(404);
        expect(body).toHaveProperty("message", expect.any(String));
        done();
      })
      // .catch(err=>{
      //   console.log(err)
      //   done()
      // })
  });
});

// READ
describe("Test GET carts", () => {
  test(`success read all carts`, (done) => {
    request(app)
      .get("/carts")
      .set("Accept", "application/json")
//       .set("access", access)
      .set("access", access_token_customer)
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(200);
        expect(body).toHaveProperty("carts", expect.any(Object));
        done();
      })
      // .catch(err=>{
      //   console.log(err)
      //   done()
      // })
  });

  test(`success read all carts`, (done) => {
    request(app)
      .get("/carts")
      .set("Accept", "application/json")
      .set("access_token", access_token_customer)
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(200);
        expect(body).toHaveProperty("carts", expect.any(Object));
        done();
      })
      // .catch(err=>{
      //   console.log(err)
      //   done()
      // })
  });

  test(`failed - invalid access token`, (done) => {
    request(app)
      .get("/carts")
      .set("NotAccept", "application/json")
      // .set("access_token", "okokokok")
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(404);
        expect(body).toHaveProperty("message", expect.any(String));
        done();
      })
      // .catch(err=>{
      //   console.log(err)
      //   done()
      // })
  });
});

// EDIT
describe("TEST UPDATE carts", () => {
  test("success update carts", (done) => {
    request(app)
      .put(`/carts/${id}`)
      .send(inputCartsSuccess)
      .set("Accept", "application/json")
//       .set("access", access)
      .set("access", access_token_customer)
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(200);
        expect(body).toHaveProperty("message", "sucess updated data");
        done();
      })
      // .catch(err=>{
      //   console.log(err)
      //   done()
      // })
  });

  test("failed to update carts - invalid access token", (done) => {
    request(app)
      .put(`/carts/${id}`)
      .send(inputCartsSuccess)
      .set("Accept", "application/json")
      // .set("access_token", 'invalid access token')
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(404);
        expect(body).toHaveProperty("message", expect.any(String));
        done();
      })
      // .catch(err=>{
      //   console.log(err)
      //   done()
      // })
  });

  test("failed to update carts - data not found", (done) => {
    request(app)
      .put(`/carts/1000`)
      .set("Accept", "application/json")
      .set("access", access_token_customer)
      .send(inputCartsSuccess)
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "data not found");
        done();
      })
      // .catch(err=>{
      //   console.log(err)
      //   done()
      // })
  });
});


// EDIT PAYMENT ONLY
describe("TEST UPDATE PAYMENT carts", () => {
  let newPayment = {
    payment_status: 'paid',
    dataId: [id, id2] // diisi id cart yang akan diubah payment karena semua pembayaran jadi satu
  }

  test("success update carts", (done) => {
    request(app)
      .patch(`/carts`)
      .send({
        payment_status: 'paid',
        dataId: [id, id2] // diisi id cart yang akan diubah payment karena semua pembayaran jadi satu
      })
      .set("Accept", "application/json")
      .set("access_token", access_token_kasir)
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(200);
        expect(body).toHaveProperty("message", "sucess updated payment");
        done();
      })
      // .catch(err=>{
      //   console.log('error upadte payment', err)
      //   done()
      // })
  });

  test("failed to update payment carts - invalid access token", (done) => {
    request(app)
      .put(`/carts/${id}`)
      .send({
        payment_status: 'paid',
        dataId: [id, id2] // diisi id cart yang akan diubah payment karena semua pembayaran jadi satu
      })
      .set("Accept", "application/json")
      .set("access_token", 'invalid access token')
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(403);
        expect(body).toHaveProperty("message", "invalid access_token");
        done();
      })
      // .catch(err=>{
      //   console.log('error upadte payment', err)
      //   done()
      // })
  });

  test("failed to update payment carts - data not found", (done) => {
    request(app)
      .put(`/carts/1000`)
      .set("Accept", "application/json")
      .set("access_token", access_token_kasir)
      .send(newPayment)
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "data not found");
        done();
      })
      // .catch(err=>{
      //   console.log(err)
      //   done()
      // })
  });
});


// DELETE
describe("TEST DELETE carts", () => {
  test("success delete carts", (done) => {
    request(app)
      .delete(`/carts/${id}`)
      .send(inputCartsSuccess)
      .set("Accept", "application/json")
      .set("access", access_token_customer)
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(200);
        expect(body).toHaveProperty("message", "sucess deleted data");
        done();
      })
      // .catch(err=>{
      //   console.log(err)
      //   done()
      // })
  });

  // test("failed to delete carts - invalid number phone", (done) => {
  //   request(app)
  //     .delete(`/carts/${id}`)
  //     .send(inputCartsSuccess)
  //     .set("Accept", "application/json")
  //     .set("access", 'invalid access token')
  //     .then((response) => {
  //       const { status, body } = response;
  //       expect(status).toBe(401);
  //       expect(body).toHaveProperty("message", "invalid access_token");
  //       done();
  //     })
  //     // .catch(err=>{
  //     //   console.log(err)
  //     //   done()
  //     // })
  // });

  test("failed to delete carts - data not found", (done) => {
    request(app)
      .delete(`/carts/1000`)
      .set("Accept", "application/json")
      .set("access", access_token_customer)
      .send(inputCartsSuccess)
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "data not found");
        done();
      })
      // .catch(err=>{
      //   console.log(err)
      //   done()
      // })
  });
});


// BULK DELETE
describe("TEST DELETE carts", () => {
  test("success bulk delete carts", (done) => {
    request(app)
      .delete(`/carts`)
      .send({
        idToDelete: [id2, id3]
      })
      .set("Accept", "application/json")
      .set("access", access_token_customer)
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(200);
        expect(body).toHaveProperty("message", "success bulk delete");
        done();
      })
      // .catch(err=>{
      //   console.log(err)
      //   done()
      // })
  });
});


afterAll((done) => {
  queryInterface
    .bulkDelete("Carts")
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
});