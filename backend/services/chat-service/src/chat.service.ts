import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  private activeSessions: Map<string, Set<string>> = new Map();

  async joinSession(clientId: string, sessionId: string, userId: string) {
    if (!this.activeSessions.has(sessionId)) {
      this.activeSessions.set(sessionId, new Set());
    }
    this.activeSessions.get(sessionId)?.add(clientId);
  }

  async handleDisconnect(clientId: string) {
    for (const [sessionId, clients] of this.activeSessions.entries()) {
      clients.delete(clientId);
      if (clients.size === 0) {
        this.activeSessions.delete(sessionId);
      }
    }
  }

  getActiveClients(sessionId: string): number {
    return this.activeSessions.get(sessionId)?.size || 0;
  }
}
