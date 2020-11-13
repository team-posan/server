const { response } = require("express");
const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const { Cart } = require("../models");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

let id = 0;
let access_token = "dummy-access-token";
let admin_access_token


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

let inputCartsSuccess = {
  ProductId: 1,
  UserId: 1,
  quantity: 20,
  payment_status: "unpayment",
};

let inputCartsFailed = {
  ProductId: null,
  UserId: "1",
  quantity: -1,
  payment_status: "unpayment",
};

let product = {
    
}

// console.log(carts);

describe.only(`TEST BOONGAN`, () => {
  // cobacobaocba
  test("hayolah", () => {
    const user = {
      name: "Albar",
      gender: "male",
      status: "bingung",
    };
    expect(user).toHaveProperty("name", expect.any(String));
  });
  // null testing
  test("is Zero or not", () => {
    const zero = 0;
    expect(zero).not.toBe(null);
    expect(zero).toBeFalsy();
    expect(zero).not.toBeTruthy();
  });
});

// CREATE
describe("test POST carts", () => {
  test("success test post carts", (done) => {
    request(app)
      .post("/carts")
      .send(inputCartsSuccess)
      .set("Accept", "application/json")
      .set("access_token", access_token)
      .then((response) => {
        const { status, body } = response;
        console.log(body);
        expect(status).toBe(201);
        expect(body).toHaveProperty("ProductId", expect.any(Number));
        expect(body).toHaveProperty("UserId", expect.any(Number));
        expect(body).toHaveProperty("quantity", expect.any(Number));
        expect(body).toHaveProperty("payment_status", expect.any(String));
        done();
      });
  });

  test(`failed test post carts invalid access token `, (done) => {
    request(app)
      .post("/carts")
      .send(inputCartsSuccess)
      .set("NotAccept", "application/json")
      .set("access_token", access_token)
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(400);
        expect(body).toHaveProperty("msg", "failed access token");
        done();
      });
  });

  test(`failed test to carts broken input`, (done) => {
    request(app)
      .post("/carts")
      .send(inputCartsFailed)
      .set("NotAccept", "application/json")
      .set("access_token", access_token)
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(400);
        expect(body).toHaveProperty("msg", "failed access token");
        done();
      });
  });
});

// READ
describe("Test GET carts", () => {
  test(`success read all carts`, (done) => {
    request(app)
      .get("/carts")
      .set("Accept", "application/json")
      .set("access_token", access_token)
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(200);
        expect(body).toHaveProperty("carts", expect.any(Object));
        done();
      });
  });

  test(`failed - invalid access token`, (done) => {
    request(app)
      .get("/carts")
      .set("NotAccept", "application/json")
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "invalid access_token");
        done();
      });
  });
});

// EDIT
describe("TEST UPDATE carts", () => {
  test("success update carts", (done) => {
    request(app)
      .put(`/carts/${id}`)
      .send(inputCartsSuccess)
      .set("Accept", "application/json")
      .set("access_token", access_token)
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(200);
        expect(body).toHaveProperty("msg", "sucess updated data");
        done();
      });
  });

  test("failed to update carts - invalid access token", (done) => {
    request(app)
      .put(`/carts/${id}`)
      .send(inputCartsSuccess)
      .set("Accept", "application/json")
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(401);
        expect(body).toHaveProperty("msg", "invalid access_token");
        done();
      });
  });

  test("failed to update carts - data not found", (done) => {
    request(app)
      .put(`/carts/${id}`)
      .send(inputCartsSuccess)
      .set("Accept", "application/json")
      .set("access_token", access_token)
      .then((response) => {
        const { status, body } = response;
        expect(status).toBe(404);
        expect(body).toHaveProperty("msg", "invalid access_token");
        done();
      });
  });
});


//delete
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
