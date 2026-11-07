import fs from "node:fs/promises";
import pool from "./db.js";

try {
  const schema = await fs.readFile(
    new URL("./schema.sql", import.meta.url),
    "utf8"
  );

  await pool.query(schema);
  console.log("ScanQ tables created successfully!");
} catch (error) {
  console.error("Schema setup failed:", error.message);
} finally {
  await pool.end();
}
