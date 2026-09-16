import { io, type Socket } from "socket.io-client";

export type RealtimeMessage = {
  id: string;
  senderId: string;
  recipientId: string;
  body: string;
  createdAt: string;
};

type ServerToClientEvents = {
  "message:new": (message: RealtimeMessage) => void;
};

type ClientToServerEvents = {
  "message:send": (
    payload: { recipientId: string; body: string },
    acknowledge: (response: { ok: boolean; error?: string; message?: RealtimeMessage }) => void,
  ) => void;
};

export function createMessageSocket(token: string): Socket<ServerToClientEvents, ClientToServerEvents> {
  return io(window.location.origin, {
    auth: { token },
    transports: ["websocket", "polling"],
  });
}
