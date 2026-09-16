import { randomUUID } from "node:crypto";
import type { Application, Booking, Property, SupportTicket, User } from "./domain";

export type BackendStore = {
  users: Map<string, User>;
  usersByEmail: Map<string, string>;
  properties: Map<string, Property>;
  applications: Map<string, Application>;
  bookings: Map<string, Booking>;
  supportTickets: Map<string, SupportTicket>;
};

export function createBackendStore(): BackendStore {
  return {
    users: new Map(),
    usersByEmail: new Map(),
    properties: new Map(),
    applications: new Map(),
    bookings: new Map(),
    supportTickets: new Map(),
  };
}

export function createId(): string {
  return randomUUID();
}

export function now(): string {
  return new Date().toISOString();
}
