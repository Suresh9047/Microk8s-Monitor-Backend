const path = require("path");
class Constant {
  API_DOCS_FILE = path.join(__dirname, "../routes/", "API_DOCS.md");
  HTTP_STATUS_200 = 200;
  HTTP_STATUS_200 = 201;
  HTTP_STATUS_400 = 400;
  HTTP_STATUS_401 = 401;
  HTTP_STATUS_403 = 403;
  HTTP_STATUS_404 = 404;
  HTTP_STATUS_500 = 500;
  // date and time related starts
  time_formats = {
    time24Full: "HH:mm:ss",
    time12Full: "hh:mm:ss",
    time24: "HH:mm",
    time12: "hh:mm",
    time12M: "hh:mm A",
    time12FullWithAMPM: "hh:mm:ss A",
  };
  // for dayjs - format strings.. starts
  date_formats = {
    // for using in dayjs formats...
    DDMMYYYYHHmmss: "DD-MM-YYYY HH:mm:ss",
    DDMMMYYYY: "DD-MMM-YYYY",
    DDMMMYYYYHHmmss: "DD-MMM-YYYY HH:mm:ss",
    DDMMMYYYYYhhmmssa: "DD-MMM-YYYY hh:mm:ss A",

    YYYYMMDD: "YYYY-MM-DD",
    YYYYMMDDhhmmssa: "YYYY-MM-DD hh:mm:ss A",
    YYYYMMDDTHHmmssZ: "YYYY-MM-DDTHH:mm:ssZ",

    YYYYMMDDHHmmss: "YYYY-MM-DD HH:mm:ss", // for DB

    // for native JS formatting if needed starts eg. react-datepicker's dateFormat's value is this , not the above dayjs format
    ddMMMyyyy: "dd-MMM-yyyy", //
    ddMMMyyyyHHmmss: "dd-MMM-yyyy HH:mm:ss",
    ddMMMyyyyhhmmssa: "dd-MMM-yyyy hh:mm:ss A",

    yyyyMMdd: "yyyy-MM-dd", //
    yyyyMMddhhmmssa: "yyyy-MM-dd hh:mm:ss A",
    yyyyMMddTHHmmssZ: "yyyy-MM-ddTHH:mm:ssZ",

    MMddMMyyyy: "MM-dd-yyyy",
    MMMd: "MMM D",
    MMMdyyyy: "MMM D, YYYY",
    // for native JS formatting if needed ends
  };
  // for dayjs - format strings.. ends
  RiyadhTZ = "Asia/Riyadh";
  IndiaTZ = "Asia/Kolkata";
  DEFAULT_TIMEZONE = this.RiyadhTZ;
  DEFAULT_DATE_FORMAT_JS = this.date_formats.ddMMMyyyy; //for native JS formatting like in datepicker
  DEFAULT_DATE_FORMAT = this.date_formats.DDMMMYYYY; // dayjs formatting... for display
  DEFAULT_DATE_FORMAT_FULL = this.date_formats.DDMMMYYYYHHmmss; // dayjs formatting... for display
  DEFAULT_DATE_FORMAT_REQUEST = this.date_formats.DDMMMYYYYHHmmss; // sent in request....
  DEFAULT_DATE_FORMAT_DB = this.date_formats.YYYYMMDDHHmmss; // DB formatting... UTC full
  DAY = "day";
  TODAY = "today";
  YESTERDAY = "yesterday";
  WEEK = "week";
  ZERO_TIME = "00:00:00";
  ALL = "all";

  // date and time related ends
  whiteList = ["/api/auth/login", "/api/auth/register"];
  saltRounds = 10;

  roles = Object.freeze({
    ADMIN: "admin",
    OPERATOR: "operator",
    CLIENT: "client",
    USER: "user",
  });
  isClient = (user) =>
    user?.roles?.some(
      (r) => r.toLowerCase() === this.roles.CLIENT.toLowerCase()
    );
  isOperator = (user) =>
    user?.roles?.some(
      (r) => r.toLowerCase() === this.roles.OPERATOR.toLowerCase()
    );
  isAdmin = (user) =>
    user?.roles?.some(
      (r) => r.toLowerCase() === this.roles.ADMIN.toLowerCase()
    );

  created_at = "created_at";
  modified_at = "modified_at";
  beforeCreate = "beforeCreate";
  afterCreate = "afterCreate";
  beforeUpdate = "beforeUpdate";

  USER_REQUIRED_FIELDS = ["username", "password", "email"];
  SAMPLE_REQUIRED_FIELDS = ["name"];
  DUPLICATE_MSG = "Duplicate record not allowed.";
}
module.exports = new Constant();
