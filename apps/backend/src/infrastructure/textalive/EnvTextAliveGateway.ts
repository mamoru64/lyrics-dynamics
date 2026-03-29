import type { TextAliveGateway } from "./TextAliveGateway.js";

export class EnvTextAliveGateway implements TextAliveGateway {
  constructor(private readonly token: string | undefined) {}

  getTokenStatus(): { configured: boolean } {
    return { configured: Boolean(this.token) };
  }
}