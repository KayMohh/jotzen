const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const port = 8000;

// Built-in body parsing (no body-parser needed)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database configuration
const dbConfig = require("./config/db");
let db;
let client;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    client = new MongoClient(dbConfig.url);
    await client.connect();
    db = client.db(); // uses the DB name from the URL
    console.log(" Connected to MongoDB:", db.databaseName);
    return db;
  } catch (err) {
    console.error(" Failed to connect to MongoDB:", err);
    process.exit(1); // Exit if DB fails
  }
}

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Jotzen API",
      version: "1.0.0",
      description:
        "A simple note-taking API inspired by Google Keep. Fast, clean, and zen.",
      contact: {
        name: "Developer",
        email: "contact@jotzen.dev",
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [],
  },
  apis: ["./app/routes/*.js"], // Path to your route files (for inline comments)
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start server only after DB connects
connectToDatabase().then(() => {
  // To Load routes and pass 'db'
  require("./app/routes")(app, db);

  app.listen(port, () => {
    console.log(`🚀 Server is live on http://localhost:${port}`);
  });
});

// Optional: Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await client.close();
  console.log(" MongoDB connection closed.");
  process.exit(0);
});
