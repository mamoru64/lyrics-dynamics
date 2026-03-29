import type { TextAliveTokenRepository } from "../../domain/repositories/TextAliveTokenRepository";

export class EnvTextAliveTokenRepository implements TextAliveTokenRepository {
    async getToken(): Promise<string> {
        const token = import.meta.env.VITE_TEXTALIVE_APP_TOKEN as string | undefined;

        if (!token || token.trim().length === 0) {
            throw new Error("VITE_TEXTALIVE_APP_TOKEN が設定されていません");
        }

        return token.trim();
    }
}