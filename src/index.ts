// src/index.ts
import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";
import { botRunner } from "./logic/botRunner";
import { mineTokens } from "./tasks/mineTokens";

// Executa o BOT inteligente a cada hora
cron.schedule("0 * * * *", async () => {
  console.log("⏰ Executando botRunner (tarefas completas)...");
  await botRunner();
});

// Executa faucets de tempos em tempos para manter saldo (extra segurança)
cron.schedule("0 */6 * * *", async () => {
  console.log("⛏️ Executando mineração periódica...");
  const wallet = process.env.WALLET!;
  await mineTokens(wallet);
});
