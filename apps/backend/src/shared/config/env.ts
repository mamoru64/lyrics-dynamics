import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });
dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 3000),
  textAliveAppToken: process.env.TEXTALIVE_APP_TOKEN,
};