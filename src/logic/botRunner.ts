// src/logic/botRunner.ts
import * as dotenv from "dotenv";
dotenv.config();

import { Wallet, JsonRpcProvider, ethers } from "ethers";
import { minePOL, mineLINK, mintATC } from "../tasks/mineTokens";
import { updateIPCA } from "../tasks/updateIPCA";
import { checkAndAmortize } from "../tasks/checkAndAmortize";
import { getLinkBalance, getAttorneycoinBalance, getPolBalance } from "./getBalance";
import { fundSubscription434, fundSubscription438 } from "./fundSubscription";
import { checkSubscriptionLoaded } from "./checkSubscription";

export async function botRunner() {
  const privateKey = process.env.SECRET!;
  const rpcUrl = process.env.INFURA_URL!;

  if (!privateKey || !rpcUrl) {
    throw new Error("❌ SECRET ou AMOY_RPC_URL não definidos no .env");
  }

  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);
  const address = wallet.address;

  console.log("🔐 PRIVATE KEY:", privateKey);
  console.log("🌐 Wallet address:", address);

  const linkBalance = await getLinkBalance(address, provider);
  const nativeBalance = await getPolBalance(address, provider);

  const now = new Date();
  const isFirstDay = now.getDate() === 1;

  console.log("Iniciando verificação passo a passo...");

  const oneDayPast = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  if (now.getTime() >= oneDayPast.getTime() && nativeBalance < ethers.parseEther("1")) {
    console.log("⚠️ Já se passaram 24h e POL está baixo");
    await minePOL(address);
    return;
  }

  const fifteenDaysPast = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
  if (now.getTime() >= fifteenDaysPast.getTime() && linkBalance < ethers.parseEther("5")) {
    console.log("⚠️ Já se passaram 15 dias e LINK está baixo");
    await mineLINK(address);
    return;
  }

  if (isFirstDay) {
    const subscriptionId434 = Number(process.env.ACCUMULATED_SUBSCRIPTION_ID!);
    const subscriptionId438 = Number(process.env.MONTHLY_SUBSCRIPTION_ID!);

    const subscription434OK = await checkSubscriptionLoaded(subscriptionId434);
    const subscription438OK = await checkSubscriptionLoaded(subscriptionId438);

    if (!subscription434OK) {
      if (nativeBalance < ethers.parseEther("1")) {
        console.log("⚠️ POL insuficiente para carregar sub 434");
        await minePOL(address);
        return;
      }
      if (linkBalance < ethers.parseEther("5")) {
        console.log("⚠️ LINK insuficiente para carregar sub 434");
        await mineLINK(address);
        return;
      }

      console.log("🔌 Carregando Subscription ID 434...");
      await fundSubscription434(wallet, subscriptionId434, ethers.parseEther("2.5"));
    }

    if (!subscription438OK) {
      if (nativeBalance < ethers.parseEther("1")) {
        console.log("⚠️ POL insuficiente para carregar sub 438");
        await minePOL(address);
        return;
      }
      if (linkBalance < ethers.parseEther("5")) {
        console.log("⚠️ LINK insuficiente para carregar sub 438");
        await mineLINK(address);
        return;
      }

      console.log("🔌 Carregando Subscription ID 438...");
      await fundSubscription438(wallet, subscriptionId438, ethers.parseEther("2.5"));
    }

    console.log("📈 Atualizando IPCA...");
    await updateIPCA(privateKey);
  }

  const tokenOK = await getAttorneycoinBalance(address, provider);
  if (!tokenOK) {
    if (nativeBalance < ethers.parseEther("1")) {
      console.log("⚠️ POL insuficiente para mintar ATC");
      await minePOL(address);
      return;
    }

    console.log("⚙️ ATC insuficiente. Executando mint...");
    await mintATC();
    return;
  }

  console.log("✅ Efetuando amortizações...");
  await checkAndAmortize(privateKey);

  console.log("✅ Ciclo concluído.");
}

setInterval(botRunner, 8000);
botRunner();
