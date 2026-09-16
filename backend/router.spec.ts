import express from "express";
import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createBackendRouter } from "./router";

let server: Server;
let baseUrl = "";

beforeAll(async () => {
  const app = express();
  app.use(express.json());
  app.use("/api/v1", createBackendRouter());

  await new Promise<void>((resolve) => {
    server = app.listen(0, () => resolve());
  });

  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Test server did not start");
  baseUrl = `http://127.0.0.1:${address.port}/api/v1`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

describe("backend API", () => {
  it("reports health and starts with no marketplace records", async () => {
    const health = await fetch(`${baseUrl}/health`);
    const hostels = await fetch(`${baseUrl}/hostels?verified=true`);

    expect(health.status).toBe(200);
    expect((await health.json()).data).toBe("in-memory-empty-store");
    expect(hostels.status).toBe(200);
    expect((await hostels.json()).data).toEqual([]);
  });

  it("creates a student session and returns the current user", async () => {
    const signup = await fetch(`${baseUrl}/auth/signup`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Test Student",
        email: `student-${Date.now()}@example.com`,
        password: "correct-horse-battery-staple",
        role: "student",
      }),
    });
    const signupBody = await signup.json();
    const me = await fetch(`${baseUrl}/me`, {
      headers: { authorization: `Bearer ${signupBody.token}` },
    });

    expect(signup.status).toBe(201);
    expect(signupBody.user).toMatchObject({ name: "Test Student", role: "student" });
    expect(signupBody.user.passwordHash).toBeUndefined();
    expect(me.status).toBe(200);
    expect((await me.json()).user.email).toBe(signupBody.user.email);
  });

  it("does not allow an unauthenticated application submission", async () => {
    const response = await fetch(`${baseUrl}/applications`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ propertyId: "00000000-0000-0000-0000-000000000000", roomName: "Room", moveInDate: "2026-09-01" }),
    });

    expect(response.status).toBe(401);
    expect((await response.json()).error.code).toBe("UNAUTHENTICATED");
  });
});
