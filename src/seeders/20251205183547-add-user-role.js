"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = [{ name: "User", desc: "Standard User role" }];

    for (const r of roles) {
      const exists = await queryInterface.rawSelect(
        "roles",
        { where: { name: r.name } },
        ["id"]
      );

      if (!exists) {
        await queryInterface.bulkInsert("roles", [
          {
            name: r.name,
            desc: r.desc,
            created_at: new Date(),
            modified_at: null,
            created_by: 1,
            modified_by: null,
          },
        ]);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // We typically don't delete roles in down migrations to prevent data loss
    // unless strictly required.
  },
};
