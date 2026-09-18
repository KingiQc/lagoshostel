import "dotenv/config";
import express from "express";
import cors from "cors";
import { AuthService } from "../auth";
import { getBackendConfig } from "../config";
import { createBackendRouter } from "..";
import { createBackendStore } from "../store";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();
  const store = createBackendStore();
  const auth = new AuthService(store, getBackendConfig());
  app.locals.arcBackend = { store, auth };

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.use("/api/v1", createBackendRouter(store, auth));

  return app;
}
