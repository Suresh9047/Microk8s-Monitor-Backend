require("dotenv").config();
module.exports = {
  // development: {
  //   username: process.env.DB_USER || "username",
  //   password: process.env.DB_PASS || "password",
  //   database: process.env.DB_NAME || "boiler_plate_express_rest",
  //   host: process.env.DB_HOST || "192.168.106",
  //   dialect: "mysql",
  //   timezone: "+00:00", // Force Sequelize to use UTC
  //   dialectOptions: {
  //     timezone: "+00:00", // Read/write as UTC
  //     // dateStrings: true, // Return dates as strings
  //     // typeCast: function (field, next) {
  //     //   if (field.type === "DATETIME" || field.type === "TIMESTAMP") {
  //     //     return field.string(); // keep raw UTC string
  //     //   }
  //     //   return next();
  //     // },
  //   },
  // },
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "razz",
    database: process.env.DB_NAME || "MonitorApp",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    timezone: "+00:00", // Force Sequelize to use UTC
    dialectOptions: {
      timezone: "+00:00", // Read/write as UTC
      // dateStrings: true, // Return dates as strings
      // typeCast: function (field, next) {
      //   if (field.type === "DATETIME" || field.type === "TIMESTAMP")
      //     return field.string(); // keep raw UTC string
      //   }
      //   return next();
      // },
    },
  },
  // test: {
  //   username: process.env.DB_USER || "root",
  //   password: process.env.DB_PASS || "",
  //   database: process.env.DB_NAME || "boiler_plate_express_rest",
  //   host: process.env.DB_HOST || "127.0.0.1",
  //   dialect: "mysql",
  //   timezone: "+00:00", // Force Sequelize to use UTC
  //   dialectOptions: {
  //     timezone: "+00:00", // Read/write as UTC
  //     // dateStrings: true, // Return dates as strings
  //     // typeCast: function (field, next) {
  //     //   if (field.type === "DATETIME" || field.type === "TIMESTAMP") {
  //     //     return field.string(); // keep raw UTC string
  //     //   }
  //     //   return next();
  //     // },
  //   },
  // },
  // production: {
  //   username: process.env.DB_USER || "username",
  //   password: process.env.DB_PASS || "password",
  //   database: process.env.DB_NAME || "boiler_plate_express_rest",
  //   host: process.env.DB_HOST || "192.168.106",
  //   dialect: "mysql",
  //   timezone: "+00:00", // Force Sequelize to use UTC
  //   dialectOptions: {
  //     timezone: "+00:00", // Read/write as UTC
  //     // dateStrings: true, // Return dates as strings
  //     // typeCast: function (field, next) {
  //     //   if (field.type === "DATETIME" || field.type === "TIMESTAMP") {
  //     //     return field.string(); // keep raw UTC string
  //     //   }
  //     //   return next();
  //     // },
  //   },
  // },
};
