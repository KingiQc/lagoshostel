import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SESSION_TTL_DAYS: z.coerce.number().int().positive().default(7),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
}).superRefine((config, context) => {
  if (Boolean(config.SUPABASE_URL) !== Boolean(config.SUPABASE_SERVICE_ROLE_KEY)) {
    context.addIssue({ code: "custom", message: "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be provided together." });
  }
});

export type BackendConfig = z.infer<typeof environmentSchema>;

export function getBackendConfig(env: NodeJS.ProcessEnv = process.env): BackendConfig {
  return environmentSchema.parse(env);
}
