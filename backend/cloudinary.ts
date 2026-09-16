import { createHash } from "node:crypto";
import type { BackendConfig } from "./config";

export function createCloudinaryUploadSignature(config: BackendConfig, userId: string, timestamp = Math.floor(Date.now() / 1000)) {
  if (!config.CLOUDINARY_CLOUD_NAME || !config.CLOUDINARY_API_KEY || !config.CLOUDINARY_API_SECRET) return null;

  const folder = `arc/properties/${userId}`;
  const signatureBase = `folder=${folder}&timestamp=${timestamp}${config.CLOUDINARY_API_SECRET}`;
  const signature = createHash("sha1").update(signatureBase).digest("hex");

  return {
    cloudName: config.CLOUDINARY_CLOUD_NAME,
    apiKey: config.CLOUDINARY_API_KEY,
    folder,
    timestamp,
    signature,
  };
}
