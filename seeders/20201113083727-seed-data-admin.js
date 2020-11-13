'use strict';
const { hashPassword } = require('../helpers/bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users',[{
      username:'admin',
      password:hashPassword('admin'),
      role:'admin',
      createdAt:new Date(),
      updatedAt:new Date()
    },{
      username:'kasirjakarta',
      password:hashPassword('admin'),
      role:'kasir',
      StoreId:null,
      createdAt:new Date(),
      updatedAt:new Date()
    },
    {
      username:'kasirbekasi',
      password:hashPassword('admin'),
      role:'kasir',
      StoreId:null,
      createdAt:new Date(),
      updatedAt:new Date()
    },
    {
      username:'Karina',
      phone_number:123456789,
      createdAt:new Date(),
      updatedAt:new Date()
    },
    {
      username:'Eggsy',
      phone_number:987654321,
      createdAt:new Date(),
      updatedAt:new Date()
    }
  ],{})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users',null,{})
  }
};
