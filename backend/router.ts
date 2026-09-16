import { Router, type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import { AuthService, getBearerToken, publicUser } from "./auth";
import { getBackendConfig } from "./config";
import { applicationStatuses, type Property, type Role, type User } from "./domain";
import { createBackendStore, createId, now, type BackendStore } from "./store";

const signupSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(2).max(120),
  password: z.string().min(8).max(128),
  role: z.enum(["student", "owner"]),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(128),
});

const propertySchema = z.object({
  name: z.string().trim().min(2).max(160),
  description: z.string().trim().max(4000).default(""),
  city: z.string().trim().min(2).max(120),
  area: z.string().trim().min(2).max(120),
  university: z.string().trim().min(2).max(160),
  distance: z.string().trim().max(80).default(""),
  photos: z.array(z.string().trim().min(1)).max(20).default([]),
  amenities: z.array(z.string().trim().min(1).max(80)).max(50).default([]),
  rooms: z.array(z.object({
    name: z.string().trim().min(1).max(120),
    beds: z.number().int().positive().max(100),
    price: z.number().positive().max(100000000),
  })).min(1).max(100),
});

const applicationSchema = z.object({
  propertyId: z.string().uuid(),
  roomName: z.string().trim().min(1).max(120),
  moveInDate: z.string().trim().min(1).max(40),
  details: z.record(z.string(), z.string().trim().max(1000)).default({}),
  documents: z.array(z.string().trim().min(1).max(160)).max(20).default([]),
});

const bookingSchema = z.object({
  propertyId: z.string().uuid(),
  roomName: z.string().trim().min(1).max(120),
  moveInDate: z.string().trim().min(1).max(40),
});

const supportSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  topic: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(5000),
});

const paymentIntentSchema = z.object({
  bookingId: z.string().uuid(),
});

const messageSchema = z.object({
  recipientId: z.string().uuid(),
  body: z.string().trim().min(1).max(5000),
});

const maintenanceSchema = z.object({
  propertyId: z.string().uuid().optional(),
  subject: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(5000),
});

const reviewSchema = z.object({
  status: z.enum(applicationStatuses),
  reviewNote: z.string().trim().max(2000).optional(),
});

const propertyReviewSchema = z.object({
  status: z.enum(["verified", "changes_requested"]),
});

type AuthedRequest = Request & { user?: User };

function safeProperty(property: Property) {
  const { ownerId: _ownerId, ...publicRecord } = property;
  return publicRecord;
}

function sendError(res: Response, status: number, code: string, message: string) {
  res.status(status).json({ error: { code, message } });
}

function parseBody<T>(schema: z.ZodType<T>, body: unknown): T | null {
  const result = schema.safeParse(body);
  return result.success ? result.data : null;
}

function requireUser(auth: AuthService, allowedRoles?: Role[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    const user = auth.getUserByToken(getBearerToken(req.header("authorization")));
    if (!user) return sendError(res, 401, "UNAUTHENTICATED", "A valid session is required.");
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return sendError(res, 403, "FORBIDDEN", "You do not have access to this resource.");
    }
    req.user = user;
    next();
  };
}

export function createBackendRouter(store: BackendStore = createBackendStore()) {
  const router = Router();
  const auth = new AuthService(store, getBackendConfig());

  router.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "arc-api", data: "in-memory-empty-store" });
  });

  router.post("/auth/signup", (req, res) => {
    const input = parseBody(signupSchema, req.body);
    if (!input) return sendError(res, 400, "INVALID_REQUEST", "Provide a valid name, email, password, and role.");

    try {
      const user = auth.createUser(input);
      const session = auth.createSession(user);
      res.status(201).json({ user: publicUser(user), token: session.token, expiresAt: session.expiresAt });
    } catch (error) {
      if (error instanceof Error && error.message === "EMAIL_ALREADY_REGISTERED") {
        return sendError(res, 409, "EMAIL_ALREADY_REGISTERED", "An account with this email already exists.");
      }
      throw error;
    }
  });

  router.post("/auth/login", (req, res) => {
    const input = parseBody(loginSchema, req.body);
    if (!input) return sendError(res, 400, "INVALID_REQUEST", "Provide a valid email and password.");

    const user = auth.authenticate(input.email, input.password);
    if (!user) return sendError(res, 401, "INVALID_CREDENTIALS", "The email or password is incorrect.");

    const session = auth.createSession(user);
    res.json({ user: publicUser(user), token: session.token, expiresAt: session.expiresAt });
  });

  router.post("/auth/logout", (req, res) => {
    auth.revokeSession(getBearerToken(req.header("authorization")));
    res.status(204).send();
  });

  router.get("/me", requireUser(auth), (req: AuthedRequest, res) => {
    res.json({ user: publicUser(req.user!) });
  });

  router.get("/hostels", (req, res) => {
    const university = typeof req.query.university === "string" ? req.query.university.toLowerCase() : undefined;
    const location = typeof req.query.location === "string" ? req.query.location.toLowerCase() : undefined;
    const room = typeof req.query.room === "string" ? req.query.room.toLowerCase() : undefined;
    const properties = [...store.properties.values()]
      .filter((property) => property.status === "verified")
      .filter((property) => !university || property.university.toLowerCase().includes(university))
      .filter((property) => !location || `${property.city} ${property.area}`.toLowerCase().includes(location))
      .filter((property) => !room || property.rooms.some((item) => item.name.toLowerCase().includes(room)))
      .map(safeProperty);

    res.json({ data: properties, meta: { count: properties.length } });
  });

  router.get("/hostels/:id", (req, res) => {
    const propertyId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const property = store.properties.get(propertyId);
    if (!property || property.status !== "verified") {
      return sendError(res, 404, "PROPERTY_NOT_FOUND", "Verified property not found.");
    }
    res.json({ data: safeProperty(property) });
  });

  router.post("/properties", requireUser(auth, ["owner"]), (req: AuthedRequest, res) => {
    const input = parseBody(propertySchema, req.body);
    if (!input) return sendError(res, 400, "INVALID_REQUEST", "Provide complete property and room details.");

    const property = {
      id: createId(),
      ownerId: req.user!.id,
      ...input,
      status: "under_review" as const,
      createdAt: now(),
    };
    store.properties.set(property.id, property);
    res.status(201).json({ data: safeProperty(property) });
  });

  router.get("/properties/mine", requireUser(auth, ["owner"]), (req: AuthedRequest, res) => {
    const properties = [...store.properties.values()]
      .filter((property) => property.ownerId === req.user!.id)
      .map(safeProperty);
    res.json({ data: properties, meta: { count: properties.length } });
  });

  router.patch("/properties/:id/review", requireUser(auth, ["university", "admin"]), (req: AuthedRequest, res) => {
    const input = parseBody(propertyReviewSchema, req.body);
    if (!input) return sendError(res, 400, "INVALID_REQUEST", "Provide a valid property review status.");

    const propertyId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const property = store.properties.get(propertyId);
    if (!property) return sendError(res, 404, "PROPERTY_NOT_FOUND", "Property not found.");

    const updated = { ...property, status: input.status };
    store.properties.set(updated.id, updated);
    res.json({ data: safeProperty(updated) });
  });

  router.post("/applications", requireUser(auth, ["student"]), (req: AuthedRequest, res) => {
    const input = parseBody(applicationSchema, req.body);
    if (!input) return sendError(res, 400, "INVALID_REQUEST", "Provide a property, room, move-in date, and valid application details.");

    const property = store.properties.get(input.propertyId);
    if (!property || property.status !== "verified") {
      return sendError(res, 404, "PROPERTY_UNAVAILABLE", "This property is not available for applications.");
    }
    if (!property.rooms.some((room) => room.name === input.roomName)) {
      return sendError(res, 400, "ROOM_NOT_FOUND", "The selected room is not available on this property.");
    }

    const timestamp = now();
    const application = {
      id: createId(),
      studentId: req.user!.id,
      ...input,
      status: "submitted" as const,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    store.applications.set(application.id, application);
    res.status(201).json({ data: application });
  });

  router.get("/applications/mine", requireUser(auth, ["student"]), (req: AuthedRequest, res) => {
    const applications = [...store.applications.values()].filter((application) => application.studentId === req.user!.id);
    res.json({ data: applications, meta: { count: applications.length } });
  });

  router.get("/applications/received", requireUser(auth, ["owner", "university", "admin"]), (req: AuthedRequest, res) => {
    const applications = [...store.applications.values()].filter((application) => {
      if (req.user!.role !== "owner") return true;
      return store.properties.get(application.propertyId)?.ownerId === req.user!.id;
    });
    res.json({ data: applications, meta: { count: applications.length } });
  });

  router.patch("/applications/:id/review", requireUser(auth, ["owner", "university", "admin"]), (req: AuthedRequest, res) => {
    const input = parseBody(reviewSchema, req.body);
    if (!input) return sendError(res, 400, "INVALID_REQUEST", "Provide a valid application status.");

    const applicationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const application = store.applications.get(applicationId);
    if (!application) return sendError(res, 404, "APPLICATION_NOT_FOUND", "Application not found.");
    const property = store.properties.get(application.propertyId);
    if (req.user!.role === "owner" && property?.ownerId !== req.user!.id) {
      return sendError(res, 403, "FORBIDDEN", "You do not manage this application.");
    }

    const updated = { ...application, status: input.status, reviewNote: input.reviewNote, updatedAt: now() };
    store.applications.set(updated.id, updated);
    res.json({ data: updated });
  });

  router.post("/bookings", requireUser(auth, ["student"]), (req: AuthedRequest, res) => {
    const input = parseBody(bookingSchema, req.body);
    if (!input) return sendError(res, 400, "INVALID_REQUEST", "Provide a property, room, and move-in date.");

    const property = store.properties.get(input.propertyId);
    const room = property?.rooms.find((item) => item.name === input.roomName);
    if (!property || property.status !== "verified" || !room) {
      return sendError(res, 404, "BOOKING_UNAVAILABLE", "This property or room is not available for booking.");
    }

    const booking = {
      id: createId(),
      studentId: req.user!.id,
      ...input,
      amount: room.price,
      status: "requested" as const,
      createdAt: now(),
    };
    store.bookings.set(booking.id, booking);
    res.status(201).json({ data: booking });
  });

  router.get("/bookings/mine", requireUser(auth, ["student"]), (req: AuthedRequest, res) => {
    const bookings = [...store.bookings.values()].filter((booking) => booking.studentId === req.user!.id);
    res.json({ data: bookings, meta: { count: bookings.length } });
  });

  router.get("/payments/mine", requireUser(auth, ["student"]), (_req, res) => {
    res.json({ data: [], meta: { count: 0, status: "payment_provider_not_configured" } });
  });

  router.post("/payments/intents", requireUser(auth, ["student"]), (req: AuthedRequest, res) => {
    const input = parseBody(paymentIntentSchema, req.body);
    if (!input) return sendError(res, 400, "INVALID_REQUEST", "Provide a valid booking id.");

    const booking = store.bookings.get(input.bookingId);
    if (!booking || booking.studentId !== req.user!.id) {
      return sendError(res, 404, "BOOKING_NOT_FOUND", "Booking not found.");
    }
    return sendError(res, 501, "PAYMENTS_NOT_CONFIGURED", "Payment processing is not connected yet.");
  });

  router.get("/messages/mine", requireUser(auth), (req: AuthedRequest, res) => {
    const messages = [...store.messages.values()].filter((message) => message.senderId === req.user!.id || message.recipientId === req.user!.id);
    res.json({ data: messages, meta: { count: messages.length } });
  });

  router.post("/messages", requireUser(auth), (req: AuthedRequest, res) => {
    const input = parseBody(messageSchema, req.body);
    if (!input) return sendError(res, 400, "INVALID_REQUEST", "Provide a recipient and message body.");
    if (!store.users.has(input.recipientId)) return sendError(res, 404, "USER_NOT_FOUND", "Recipient not found.");

    const message = { id: createId(), senderId: req.user!.id, ...input, createdAt: now() };
    store.messages.set(message.id, message);
    res.status(201).json({ data: message });
  });

  router.get("/notifications/mine", requireUser(auth), (req: AuthedRequest, res) => {
    const notifications = [...store.notifications.values()].filter((notification) => notification.userId === req.user!.id);
    res.json({ data: notifications, meta: { count: notifications.length } });
  });

  router.get("/maintenance/mine", requireUser(auth, ["student"]), (req: AuthedRequest, res) => {
    const requests = [...store.maintenanceRequests.values()].filter((request) => request.studentId === req.user!.id);
    res.json({ data: requests, meta: { count: requests.length } });
  });

  router.post("/maintenance", requireUser(auth, ["student"]), (req: AuthedRequest, res) => {
    const input = parseBody(maintenanceSchema, req.body);
    if (!input) return sendError(res, 400, "INVALID_REQUEST", "Provide a subject and maintenance description.");
    if (input.propertyId && !store.properties.has(input.propertyId)) return sendError(res, 404, "PROPERTY_NOT_FOUND", "Property not found.");

    const request = { id: createId(), studentId: req.user!.id, ...input, status: "submitted" as const, createdAt: now() };
    store.maintenanceRequests.set(request.id, request);
    res.status(201).json({ data: request });
  });

  router.post("/support/tickets", (req, res) => {
    const input = parseBody(supportSchema, req.body);
    if (!input) return sendError(res, 400, "INVALID_REQUEST", "Provide a name, valid email, topic, and message.");

    const user = auth.getUserByToken(getBearerToken(req.header("authorization")));
    const ticket = { id: createId(), ...input, userId: user?.id, createdAt: now() };
    store.supportTickets.set(ticket.id, ticket);
    res.status(201).json({ data: { id: ticket.id, status: "received", createdAt: ticket.createdAt } });
  });

  router.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(error);
    sendError(res, 500, "INTERNAL_ERROR", "The server could not complete the request.");
  });

  return router;
}
