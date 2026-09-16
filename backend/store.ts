import { randomUUID } from "node:crypto";
import type { Application, Booking, MaintenanceRequest, Message, Notification, Property, SupportTicket, User } from "./domain";

export type BackendStore = {
  users: Map<string, User>;
  usersByEmail: Map<string, string>;
  properties: Map<string, Property>;
  applications: Map<string, Application>;
  bookings: Map<string, Booking>;
  maintenanceRequests: Map<string, MaintenanceRequest>;
  messages: Map<string, Message>;
  notifications: Map<string, Notification>;
  supportTickets: Map<string, SupportTicket>;
};

export function createBackendStore(): BackendStore {
  return {
    users: new Map(),
    usersByEmail: new Map(),
    properties: new Map(),
    applications: new Map(),
    bookings: new Map(),
    maintenanceRequests: new Map(),
    messages: new Map(),
    notifications: new Map(),
    supportTickets: new Map(),
  };
}

export function createId(): string {
  return randomUUID();
}

export function now(): string {
  return new Date().toISOString();
}
