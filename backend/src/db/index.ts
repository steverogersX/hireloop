import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env, isProd } from "@/config/env";
import * as schema from "./schema";

const client = postgres(env.DATABASE_URL, { max: isProd ? 10 : 5 });

export const db = drizzle(client, { schema, logger: !isProd });
export { schema, client };
