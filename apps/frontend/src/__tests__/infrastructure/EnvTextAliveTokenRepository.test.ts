import { describe, it, expect, vi, afterEach } from "vitest";
import { EnvTextAliveTokenRepository } from "../../infrastructure/config/EnvTextAliveTokenRepository";

describe("EnvTextAliveTokenRepository", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("環境変数が設定されている場合はトークンを返す", async () => {
        vi.stubEnv("VITE_TEXTALIVE_APP_TOKEN", "my-token-xyz");

        const repository = new EnvTextAliveTokenRepository();
        const token = await repository.getToken();

        expect(token).toBe("my-token-xyz");
    });

    it("前後の空白を取り除いたトークンを返す", async () => {
        vi.stubEnv("VITE_TEXTALIVE_APP_TOKEN", "  trimmed-token  ");

        const repository = new EnvTextAliveTokenRepository();
        const token = await repository.getToken();

        expect(token).toBe("trimmed-token");
    });

    it("環境変数が未設定の場合はエラーをスローする", async () => {
        vi.stubEnv("VITE_TEXTALIVE_APP_TOKEN", "");

        const repository = new EnvTextAliveTokenRepository();

        await expect(repository.getToken()).rejects.toThrow(
            "VITE_TEXTALIVE_APP_TOKEN が設定されていません",
        );
    });

    it("環境変数が空白のみの場合はエラーをスローする", async () => {
        vi.stubEnv("VITE_TEXTALIVE_APP_TOKEN", "   ");

        const repository = new EnvTextAliveTokenRepository();

        await expect(repository.getToken()).rejects.toThrow(
            "VITE_TEXTALIVE_APP_TOKEN が設定されていません",
        );
    });
});
