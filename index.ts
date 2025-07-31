import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";
import { checkAndAmortize } from "./tasks/checkAndAmortize";
import { updateIPCA } from "./tasks/updateIPCA";
import { mineTokens } from "./tasks/mineTokens";

const SECRET = process.env.SECRET!;
const WALLET = process.env.WALLET!;

// A cada hora
cron.schedule("0 * * * *", async () => {
  await updateIPCA(SECRET);
  await checkAndAmortize(SECRET);
});

// A cada 6 horas
cron.schedule("0 */6 * * *", async () => {
  await mineTokens(WALLET);
});
