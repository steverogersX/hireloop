import { createApp } from "@/app";
import { env } from "@/config/env";
import { client } from "@/db";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}/api`);
});

async function shutdown(signal: string) {
  console.log(`${signal} received, shutting down`);
  server.close(async () => {
    await client.end({ timeout: 5 });
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
