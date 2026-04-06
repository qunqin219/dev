import path from "path";
import "dotenv/config";
import { defineConfig } from "prisma/config";

const databasePath = path.join(process.cwd(), "prisma", "dev.db");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: `file:${databasePath}`,
  },
});
