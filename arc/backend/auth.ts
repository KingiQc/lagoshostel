import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { BackendConfig } from "./config";
import type { Role, Session, User } from "./domain";
import { createId, now, type BackendStore } from "./store";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, expectedHash] = storedHash.split(":");
  if (!salt || !expectedHash) return false;

  const actualHash = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHash, "hex");
  return expected.length === actualHash.length && timingSafeEqual(expected, actualHash);
}

export class AuthService {
  private readonly sessions = new Map<string, Session>();

  constructor(
    private readonly store: BackendStore,
    private readonly config: BackendConfig,
  ) {}

  createUser(input: { email: string; name: string; password: string; role: Role }): User {
    const email = input.email.trim().toLowerCase();
    if (this.store.usersByEmail.has(email)) {
      throw new Error("EMAIL_ALREADY_REGISTERED");
    }

    const user: User = {
      id: createId(),
      email,
      name: input.name.trim(),
      role: input.role,
      passwordHash: hashPassword(input.password),
      createdAt: now(),
    };

    this.store.users.set(user.id, user);
    this.store.usersByEmail.set(user.email, user.id);
    return user;
  }

  authenticate(email: string, password: string): User | null {
    const userId = this.store.usersByEmail.get(email.trim().toLowerCase());
    if (!userId) return null;

    const user = this.store.users.get(userId);
    return user && verifyPassword(password, user.passwordHash) ? user : null;
  }

  createSession(user: User): Session {
    const session: Session = {
      token: randomBytes(32).toString("hex"),
      userId: user.id,
      expiresAt: Date.now() + this.config.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
    };
    this.sessions.set(session.token, session);
    return session;
  }

  getUserByToken(token: string | undefined): User | null {
    if (!token) return null;
    const session = this.sessions.get(token);
    if (!session) return null;
    if (session.expiresAt <= Date.now()) {
      this.sessions.delete(token);
      return null;
    }
    return this.store.users.get(session.userId) ?? null;
  }

  revokeSession(token: string | undefined): void {
    if (token) this.sessions.delete(token);
  }
}

export function getBearerToken(header: string | undefined): string | undefined {
  if (!header?.startsWith("Bearer ")) return undefined;
  return header.slice("Bearer ".length).trim() || undefined;
}

export function publicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  };
}
