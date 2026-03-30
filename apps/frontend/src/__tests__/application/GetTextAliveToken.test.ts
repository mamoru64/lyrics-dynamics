import { describe, it, expect, vi } from "vitest";
import { GetTextAliveToken } from "../../application/usecases/GetTextAliveToken";
import type { TextAliveTokenRepository } from "../../domain/repositories/TextAliveTokenRepository";

describe("GetTextAliveToken", () => {
    it("リポジトリからトークンを返す", async () => {
        const mockRepository: TextAliveTokenRepository = {
            getToken: vi.fn().mockResolvedValue("test-token-123"),
        };

        const usecase = new GetTextAliveToken(mockRepository);
        const token = await usecase.execute();

        expect(token).toBe("test-token-123");
        expect(mockRepository.getToken).toHaveBeenCalledOnce();
    });

    it("リポジトリがエラーをスローした場合は例外を伝播する", async () => {
        const mockRepository: TextAliveTokenRepository = {
            getToken: vi.fn().mockRejectedValue(new Error("token error")),
        };

        const usecase = new GetTextAliveToken(mockRepository);

        await expect(usecase.execute()).rejects.toThrow("token error");
    });
});
