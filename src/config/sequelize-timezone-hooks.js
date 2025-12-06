const { literal, Sequelize } = require("sequelize");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const {
  DEFAULT_TIMEZONE,
  DEFAULT_DATE_FORMAT_DB,
  created_at,
  modified_at,
  beforeUpdate,
  beforeCreate,
} = require("../utils/constants");

function applyGlobalTimezoneHooks(sequelize) {
  sequelize.addHook(beforeCreate, (instance) => {
    const nowUTC = dayjs().utc().format(DEFAULT_DATE_FORMAT_DB);
    // const nowUTC = dayjs()
    //   .tz(DEFAULT_TIMEZONE)
    //   .utc()
    //   .format(DEFAULT_DATE_FORMAT_DB);

    if (instance.constructor.rawAttributes.created_at) {
      // nowUTC is already UTC , so block sequelize from apply offset again. use literal()
      // instance.setDataValue(created_at, nowUTC);
      instance.setDataValue(created_at, literal(`'${nowUTC}'`));
    }
  });
  // // do not enable this. DB default value("NULL ON UPDATE CURRENT_TIMESTAMP") will handle it...
  // sequelize.addHook("afterCreate", (instance) => {
  //   const nowUTC = dayjs().utc().format(DEFAULT_DATE_FORMAT_DB);
  //   // const nowUTC = dayjs()
  //   //   .tz(DEFAULT_TIMEZONE)
  //   //   .utc()
  //   //   .format(DEFAULT_DATE_FORMAT_DB);

  //   if (instance.constructor.rawAttributes.modified_at) {
  //     instance.setDataValue(
  //       created_at,
  //       instance.constructor.rawAttributes.modified_at
  //     );
  //   }
  // });
  // // do not enable this. DB default value("NULL ON UPDATE CURRENT_TIMESTAMP") will handle it...
  // sequelize.addHook(beforeUpdate, (instance) => {
  //   const nowUTC = dayjs().utc().format(DEFAULT_DATE_FORMAT_DB);
  //   // const nowUTC = dayjs()
  //   //   .tz(DEFAULT_TIMEZONE)
  //   //   .utc()
  //   //   .format(DEFAULT_DATE_FORMAT_DB);

  //   if (instance.constructor.rawAttributes.modified_at) {
  //     // nowUTC is already UTC , so block sequelize from apply offset again. use literal()
  //     // instance.setDataValue(modified_at, nowUTC);
  //     instance.setDataValue(modified_at, literal(`'${nowUTC}'`));
  //   }
  // });
}

module.exports = applyGlobalTimezoneHooks;
