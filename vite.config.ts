import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import type { Server as NodeHttpServer } from "node:http";
import { attachRealtime } from "./arc/backend/realtime";
import { createServer } from "./arc/backend/server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./arc/front end", "./arc/shared", "index.html"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "arc/backend/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./arc/front end"),
      "@shared": path.resolve(__dirname, "./arc/shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
      if (server.httpServer) attachRealtime(server.httpServer as NodeHttpServer, app.locals.arcBackend.store, app.locals.arcBackend.auth);
    },
  };
}
