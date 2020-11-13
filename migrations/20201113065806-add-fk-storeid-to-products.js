"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("Products", {
      fields: ["StoreId"],
      type: "foreign key",
      name: "add fk storeid to products",
      references: {
        table: "Stores",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("Products", "StoreId", {});
  },
};
