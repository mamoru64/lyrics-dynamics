export interface TextAliveGateway {
  getTokenStatus(): { configured: boolean };
  getClientToken(): string | null;
}