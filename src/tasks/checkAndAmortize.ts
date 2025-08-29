import { getAmortizationContract, getMintingContract } from "../utils/getContract";
import { getPolBalance } from "../logic/getBalance";
import { Wallet, ethers } from "ethers";


export async function getUpcomingAmortizations(privateKey: string) {
  const wallet = new Wallet(privateKey);
  const amortizationContract = getAmortizationContract(wallet);
  const mintingContract = getMintingContract(wallet);

  const bondQueue: { bondId: number; investor: string; timeLeft: number }[] = [];
  
  let bondId = 0;

  const now = Math.floor(Date.now() / 1000);
  const FORTY_EIGHT_HOURS = 48 * 60 * 60;

  for (let id = 0; id < bondId; id++) {
    const bond = await mintingContract.getBondDetails(id);
    const investor = await mintingContract.getInvestorByBondId(id);
    const paymentsMade = await amortizationContract.getPaymentsmade(investor, id);
    const lastPayment = await amortizationContract.getTimeLeft(investor, id);

    if (paymentsMade >= bond.frequency) continue;

    const periodDuration = Math.floor((bond.maturityDate - bond.issueDate) / bond.frequency);
    const nextDue = Number(lastPayment) + periodDuration;
    const timeLeft = nextDue - now;

    if (timeLeft <= FORTY_EIGHT_HOURS && timeLeft > 0) {
      bondQueue.push({ bondId: id, investor: investor, timeLeft: timeLeft });
    }
  }

  // Ordena pelo menor tempo restante
  bondQueue.sort((a, b) => a.timeLeft - b.timeLeft);

  return bondQueue;
}

export async function checkAndAmortize(privateKey: string) {
  const wallet = new Wallet(privateKey);
  const provider = wallet.provider!;
  const amortizationContract = getAmortizationContract(wallet);
  const mintingContract = getMintingContract(wallet);

  const balance = await getPolBalance(wallet.address, provider);
  if (balance < ethers.parseEther("0.5")) {
    console.log("Saldo insuficiente para pagar gás.");
    return;
  }

  const upcoming = await getUpcomingAmortizations(privateKey);

  for (const bond of upcoming) {
    const now = Math.floor(Date.now() / 1000);
    const nextDue = now + bond.timeLeft;

    if (now >= nextDue) {
      try {
        const tx = await amortizationContract.transferAmortization(bond.bondId);
        await tx.wait();
        console.log(`✅ Amortizado bond ${bond.bondId}`);
      } catch (err) {
        console.error(`❌ Falha ao amortizar bond ${bond.bondId}`, err);
      }
    }
  }
}
