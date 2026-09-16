import { describe, expect, it } from "vitest";
import { getBackendConfig } from "./config";
import { createSupabaseAdminClient, getPersistenceProvider } from "./supabase";

describe("Supabase configuration", () => {
  it("keeps the empty memory provider when credentials are absent", () => {
    const config = getBackendConfig({ NODE_ENV: "test", SESSION_TTL_DAYS: "7" });

    expect(getPersistenceProvider(config)).toBe("memory");
    expect(createSupabaseAdminClient(config)).toBeNull();
  });

  it("requires both Supabase credentials together", () => {
    expect(() => getBackendConfig({ SUPABASE_URL: "https://example.supabase.co" })).toThrow();
    expect(() => getBackendConfig({ SUPABASE_SERVICE_ROLE_KEY: "key" })).toThrow();
  });
});
