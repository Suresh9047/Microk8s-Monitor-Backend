const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

// Swagger definition
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Monitor App API",
        version: "1.0.0",
        description: "API Documentation for Monitor App",
        license: {
            name: "MIT",
            url: "https://opensource.org/licenses/MIT",
        },
        contact: {
            name: "Support",
            email: "support@arffy.example.com",
        },
    },
    servers: [
        {
            url: "http://0.0.0.0:8000/api",
            description: "Development Server",
        },
        {
            url: "http://localhost:8000/api",
            description: "Localhost Access",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};

// Options for the swagger docs
const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: [
        path.join(__dirname, "../routes/*.routes.js"),
        path.join(__dirname, "../models/*.js"),
    ],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
