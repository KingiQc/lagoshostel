import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SESSION_TTL_DAYS: z.coerce.number().int().positive().default(7),
});

export type BackendConfig = z.infer<typeof environmentSchema>;

export function getBackendConfig(env: NodeJS.ProcessEnv = process.env): BackendConfig {
  return environmentSchema.parse(env);
}
