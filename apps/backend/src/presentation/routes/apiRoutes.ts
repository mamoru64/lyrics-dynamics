import { Router } from "express";
import type { GenerateRealtimeExpression } from "../../application/usecases/GenerateRealtimeExpression.js";
import type { ExpressionRepository } from "../../domain/repositories/ExpressionRepository.js";
import type { TextAliveGateway } from "../../infrastructure/textalive/TextAliveGateway.js";

interface Dependencies {
  usecase: GenerateRealtimeExpression;
  repository: ExpressionRepository;
  textAlive: TextAliveGateway;
}

export const createApiRoutes = ({ usecase, repository, textAlive }: Dependencies): Router => {
  const router = Router();

  router.get("/health", (_req, res) => {
    res.json({ status: "ok", language: "ja" });
  });

  router.get("/textalive/status", (_req, res) => {
    res.json(textAlive.getTokenStatus());
  });

  router.get("/textalive/token", (_req, res) => {
    const token = textAlive.getClientToken();
    if (!token) {
      res.status(503).json({ message: "TEXTALIVE_APP_TOKEN が設定されていません" });
      return;
    }
    res.json({ token });
  });

  router.post("/expressions/realtime", async (req, res, next) => {
    try {
      const { lyric, bpm, timestamp } = req.body as {
        lyric?: string;
        bpm?: number;
        timestamp?: number;
      };

      if (!lyric || typeof bpm !== "number" || typeof timestamp !== "number") {
        res.status(400).json({ message: "lyric, bpm, timestamp は必須です" });
        return;
      }

      const expression = await usecase.execute({ lyric, bpm, timestamp });
      res.json(expression);
    } catch (error) {
      next(error);
    }
  });

  router.get("/expressions/recent", async (req, res, next) => {
    try {
      const limit = Number(req.query.limit ?? 20);
      const expressions = await repository.listRecent(limit);
      res.json(expressions);
    } catch (error) {
      next(error);
    }
  });

  return router;
};