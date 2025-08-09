const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
// require("./note_routes");

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
