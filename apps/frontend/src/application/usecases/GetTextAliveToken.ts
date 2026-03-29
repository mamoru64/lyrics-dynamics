import type { TextAliveTokenRepository } from "../../domain/repositories/TextAliveTokenRepository";

export class GetTextAliveToken {
    constructor(private readonly repository: TextAliveTokenRepository) { }

    execute(): Promise<string> {
        return this.repository.getToken();
    }
}