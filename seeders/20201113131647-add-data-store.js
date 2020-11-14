'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Stores',[
      {
        store_name:'jakarta',
        store_address:'jakarta raya no 1',
        createdAt:new Date(),
        updatedAt:new Date()
      },
      {
        store_name:'bekasi',
        store_address:'bekasi raya no 1',
        createdAt:new Date(),
        updatedAt:new Date()
      }
  ],{})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Stores',null,{})
  }
};
