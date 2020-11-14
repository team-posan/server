const request = require("supertest");
const app = require("../app.js");
const { signToken } = require("../helpers/jwt.js");
const { User } = require('../models')



var access_token_admin

beforeAll((done)=>{
    User.findOne({where:{username:'admin'}})
       .then(result=>{
          access_token_admin = signToken({id:result.id,username:result.username,role:result.role,StoreId:result.StoreId})
          done()
       })
 })


 