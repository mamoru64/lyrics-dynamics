import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApiRoutes } from "./presentation/routes/apiRoutes.js";
import { initializeDatabase, db } from "./shared/db/sqlite.js";
import { SqliteExpressionRepository } from "./infrastructure/persistence/SqliteExpressionRepository.js";
import { HeuristicLyricAnalysisService } from "./infrastructure/ai/HeuristicLyricAnalysisService.js";
import { GenerateRealtimeExpression } from "./application/usecases/GenerateRealtimeExpression.js";
import { EnvTextAliveGateway } from "./infrastructure/textalive/EnvTextAliveGateway.js";
import { env } from "./shared/config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bootstrap = async (): Promise<void> => {
  await initializeDatabase();

  const repository = new SqliteExpressionRepository(db);
  const analyzer = new HeuristicLyricAnalysisService();
  const usecase = new GenerateRealtimeExpression(analyzer, repository);
  const textAlive = new EnvTextAliveGateway(env.textAliveAppToken);

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api", createApiRoutes({ usecase, repository, textAlive }));

  const frontendDist = path.resolve(__dirname, "../../frontend/dist");
  app.use(express.static(frontendDist));

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = error instanceof Error ? error.message : "internal error";
    res.status(500).json({ message });
  });

  app.listen(env.port, () => {
    console.log(`Server listening on http://localhost:${env.port}`);
  });
};

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});