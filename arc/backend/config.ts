import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SESSION_TTL_DAYS: z.coerce.number().int().positive().default(7),
  MONGODB_URI: z.string().min(1).refine((value) => /^(mongodb|mongodb\+srv):\/\//.test(value), "MONGODB_URI must be a MongoDB connection string.").optional(),
  MONGODB_DB: z.string().min(1).optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
}).superRefine((config, context) => {
  if (Boolean(config.MONGODB_URI) !== Boolean(config.MONGODB_DB)) {
    context.addIssue({ code: "custom", message: "MONGODB_URI and MONGODB_DB must be provided together." });
  }
  const cloudinaryValues = [config.CLOUDINARY_CLOUD_NAME, config.CLOUDINARY_API_KEY, config.CLOUDINARY_API_SECRET];
  if (cloudinaryValues.some(Boolean) && cloudinaryValues.some((value) => !value)) {
    context.addIssue({ code: "custom", message: "CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET must be provided together." });
  }
});

export type BackendConfig = z.infer<typeof environmentSchema>;

export function getBackendConfig(env: NodeJS.ProcessEnv = process.env): BackendConfig {
  return environmentSchema.parse(env);
}
