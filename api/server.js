import express from "express";
import pg from "pg";

const { Pool } = pg;

const requiredVariables = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"];

for (const variableName of requiredVariables) {
  if (!process.env[variableName]) {
    console.error(`${variableName} is required`);
    process.exit(1);
  }
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: Number(process.env.DB_POOL_MAX || 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

const app = express();
const port = Number(process.env.PORT || 3000);

app.get("/", (request, response) => {
  response.status(200).json({
    service: "products-api",
    recordsEndpoint: "/api/products",
    healthEndpoint: "/healthz",
    readinessEndpoint: "/readyz"
  });
});

app.get("/healthz", (request, response) => {
  response.status(200).json({ status: "ok" });
});

app.get("/readyz", async (request, response) => {
  let client;

  try {
    client = await pool.connect();
    await client.query("select 1");
    response.status(200).json({ status: "ready" });
  } catch (error) {
    response.status(503).json({ status: "not_ready" });
  } finally {
    if (client) {
      client.release();
    }
  }
});

app.get("/api/products", async (request, response) => {
  try {
    const result = await pool.query(
      "select id, name, category, price, stock from products order by id"
    );

    response.status(200).json({ items: result.rows });
  } catch (error) {
    response.status(500).json({ message: "Unable to fetch products" });
  }
});

app.get("/api/load", (request, response) => {
  const requestedDuration = Number(request.query.duration || 30000);
  const duration = Math.min(Math.max(requestedDuration, 1000), 120000);
  const endTime = Date.now() + duration;
  let value = 0;

  while (Date.now() < endTime) {
    value += Math.sqrt(Math.random() * 10000);
  }

  response.status(200).json({ durationMs: duration, value: Number(value.toFixed(2)) });
});

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`products-api started on port ${port}`);
});

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
