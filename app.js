require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const authRoutes = require("./src/routes/auth.routes");
const protectedRoutes = require("./src/routes/protected.routes");
const {
  authenticateToken,
  attachRolesAndPermissions,
} = require("./src/middleware/authenticate.middleware");
const { authorizeRoles } = require("./src/middleware/authorize.middleware");
const { API_DOCS_FILE } = require("./src/utils/constants");

const AppError = require("./src/responses/apperror");
const { error } = require("./src/responses/response");

const allowedOrigins = [
  "http://localhost:3006", // local dev (optional)
  "http://localhost:8000", // Allow self
  "http://0.0.0.0:8000",   // Allow self
  undefined, // allow mobile apps with no Origin
  "null", // some mobile/webviews send 'null'
];

const app = express();
// app.use(cors()); //THis cors() place is very IMPORTANT. don't put it after any of the routes definitions...
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, Postman)
      if (!origin) {
        return callback(null, true);
      }

      // Allow requests from allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Block everything else
      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

// Default route
// app.get("/", (req, res) => {
//   res.send("Main application home page");
// });
app.get("/", (req, res) => {
  const content = fs.readFileSync(API_DOCS_FILE, "utf-8");
  console.log("Welcome.");
  res.type("text/plain").send(content);
});

// Public routes
app.use("/api/auth", authRoutes);

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");

// Serve Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // Protected routes
app.use(
  "/api",
  authenticateToken,
  attachRolesAndPermissions,
  authorizeRoles(["admin", "client"]),
  protectedRoutes
);
// app.use("/api", protectedRoutes);

// catch all errors
app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof AppError) {
    const appErrorObj = {
      status: err.status,
      code: err.code,
      message: err.message,
      details: err.details,
    };
    console.log("Application Error thrown : ", appErrorObj);
    return error(res, appErrorObj);
  }

  const serverErrObj = {
    status: 500,
    code: "INTERNAL_ERROR",
    message: "Internal server error",
  };
  console.log("Internal server error thrown : ", serverErrObj);
  return error(res, serverErrObj);
});

// Server start
const host = "0.0.0.0"; // <-- Listen on all interfaces
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
  console.log(`Server running: http://${host}:${port}`);
});
