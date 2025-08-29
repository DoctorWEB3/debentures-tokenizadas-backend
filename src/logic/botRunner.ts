// src/logic/botRunner.ts
import { ethers, Wallet } from "ethers";
import { minePOL, mineLINK, mintATC } from "../tasks/mineTokens";
import { updateIPCA } from "../tasks/updateIPCA";
import { checkAndAmortize } from "../tasks/checkAndAmortize";
import { getLinkBalance, getAttorneycoinBalance, getPolBalance } from "./getBalance";
import { fundSubscription434, fundSubscription438 } from "./fundSubscription";
import { checkSubscriptionLoaded } from "./checkSubscription";

export async function botRunner() {
  const privateKey = process.env.SECRET!;
  const wallet = new Wallet(privateKey);
  const provider = wallet.provider!;
  const address = wallet.address;

  const linkBalance = await getLinkBalance(address, provider);
  const nativeBalance = await getPolBalance(address, provider);

  const now = new Date();
  const isFirstDay = now.getDate() === 1;

  console.log("Iniciando verificação passo a passo...");

  // Minera POL (nativo) a cada 24h
  const ondeDayPast = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  if (now.getTime() >= ondeDayPast.getTime()) {
    console.log("Já se passaram 24h");
    await minePOL(address);
    return;
  }

  // Minera LINK a cada 15 dias
  const fifteenDaysPast = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
  if (now.getTime() >= fifteenDaysPast.getTime()) {
    console.log("Já se passaram 15 dias. Tentando minerar LINK...");
    await mineLINK(address);
    return;
  }

  // Se for dia 1, atualiza IPCA
  if (isFirstDay) {
    // Verifica se Subscription ID está carregado
    const subscriptionId434 = Number(process.env.ACCUMULATED_SUBSCRIPTION_ID!);
    const subscriptionId438 = Number(process.env.MONTHLY_SUBSCRIPTION_ID!);
    const subscription434OK = await checkSubscriptionLoaded(subscriptionId434);
    const subscription438OK = await checkSubscriptionLoaded(subscriptionId438);

    if (!subscription434OK) {
      // Verifica saldo de POL antes de minerar LINK para pagar carregamento da Subscription
      if (nativeBalance < ethers.parseEther("1")) {
        console.log("POL abaixo do mínimo na carteira");
        await minePOL(address);
        return;
      }
        if (linkBalance < ethers.parseEther("5")) {
          console.log("LINK insuficiente. Tentando minerar...");
          await mineLINK(address);
          return;
        }
        // Carrega Subscription ID 434
        console.log("🔌 Carregando Subscription ID...");
        await fundSubscription434(wallet, subscriptionId434, ethers.parseEther("2.5"));
    }

    if (!subscription438OK) {
      // Verifica saldo de POL antes de minerar LINK para pagar carregamento da Subscription
      if (nativeBalance < ethers.parseEther("1")) {
        console.log("POL abaixo do mínimo na carteira");
        await minePOL(address);
        return;
      }
        if (linkBalance < ethers.parseEther("5")) {
          console.log("LINK insuficiente. Tentando minerar...");
          await mineLINK(address);
          return;
        }
        // Carrega Subscription ID 438
        console.log("🔌 Carregando Subscription ID...");
        await fundSubscription438(wallet, subscriptionId438, ethers.parseEther("2.5"));
    }
    console.log("📈 Verificando atualização do IPCA...");
    await updateIPCA(privateKey);
  }

  // Verifica saldo do token de pagamento
  const tokenOK = await getAttorneycoinBalance(address, provider);
  if (!tokenOK) {
    // Verifica saldo de POL antes mintar ATC para pagar amortização
      if (nativeBalance < ethers.parseEther("1")) {
        console.log("POL abaixo do mínimo na carteira");
        await minePOL(address);
        return;
      }
      console.log("Token de pagamento insuficiente. Suspenso até mint.");
      await mintATC();
      return;
  }

  // 7. Efetua amortizações
  console.log("✅ Efetuando amortizações...");
  await checkAndAmortize(privateKey);

  console.log("Ciclo concluído.");
}

setInterval(botRunner, 8000);

botRunner();
