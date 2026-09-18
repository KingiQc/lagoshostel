import { describe, expect, it } from "vitest";
import { getBackendConfig } from "./config";
import { createMongoClient, getPersistenceProvider } from "./mongodb";

describe("MongoDB configuration", () => {
  it("keeps the empty memory provider when Atlas credentials are absent", () => {
    const config = getBackendConfig({ NODE_ENV: "test", SESSION_TTL_DAYS: "7" });

    expect(getPersistenceProvider(config)).toBe("memory");
    expect(createMongoClient(config)).toBeNull();
  });

  it("requires the Atlas URI and database name together", () => {
    expect(() => getBackendConfig({ MONGODB_URI: "mongodb+srv://example" })).toThrow();
    expect(() => getBackendConfig({ MONGODB_DB: "arc" })).toThrow();
  });

  it("creates an unconnected Mongo client without contacting Atlas", () => {
    const config = getBackendConfig({ MONGODB_URI: "mongodb://localhost:27017", MONGODB_DB: "arc" });
    const client = createMongoClient(config);

    expect(client).not.toBeNull();
    void client?.close();
  });
});
