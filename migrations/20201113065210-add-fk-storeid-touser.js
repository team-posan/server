"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("Users", {
      fields: ["StoreId"],
      type: "foreign key",
      name: "add fk store id to users",
      references: {
        table: "Stores",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstaints("Users", "StoreId", {});
  },
};
