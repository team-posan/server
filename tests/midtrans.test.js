const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const { signToken } = require("../helpers/jwt.js");
const { User } = require('../models')


var access_token_customer
let access_token_kasir
let access_token_admin


beforeAll(async (done)=>{
  const customer = await User.findOne({where:{phone_number:'123456789'}})
  const kasir = await User.findOne({where:{username:'kasirjakarta'}})
  const admin = await User.findOne({where:{username:'admin'}})
  access_token_admin = signToken({id:admin.id,username:admin.username,role:admin.role,StoreId:admin.StoreId})
  access_token_customer = signToken({id:customer.id,role:customer.role, phone_number: customer.phone_number})
  access_token_kasir = signToken({id:kasir.id,username:kasir.username,role:kasir.role,StoreId:kasir.StoreId})
  done()
})


describe('Midtrans Testing',()=>{
    test.only('check status testing', (done)=>{
    request(app)
      .post("/midtrans/verify")
      .send({
        transaction_status: 'settlement',
        order_id:'208'
      })
      .then((response) => {
        const { status, body } = response;
        console.log(body)
        expect(status).toBe(201);
        expect(body).toHaveProperty("message", expect.any(String));
        done();
      })
    })
})