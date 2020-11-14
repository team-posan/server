"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("Carts", {
      fields: ["UserId"],
      type: "foreign key",
      name: "add fk userid to carts",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addConstraint("Carts", {
      fields: ["ProductId"],
      type: "foreign key",
      name: "add fk product id to carts",
      references: {
        table: "Products",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstaint("Carts", "add fk userid to carts", {});
    await queryInterface.removeConstaint("Carts", "add fk product id to carts", {});
  },
};
