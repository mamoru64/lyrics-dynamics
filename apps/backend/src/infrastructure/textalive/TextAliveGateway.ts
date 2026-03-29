export interface TextAliveGateway {
  getTokenStatus(): { configured: boolean };
}