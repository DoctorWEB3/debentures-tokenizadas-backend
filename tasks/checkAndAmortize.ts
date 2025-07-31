import { getContract } from "../utils/getContract";
import { getBalance } from "../utils/checkBalance";
import { Wallet, ethers } from "ethers";

export async function checkAndAmortize(privateKey: string) {
  const wallet = new Wallet(privateKey);
  const contract = getContract(wallet);

  const balance = await getBalance(wallet.address);
  if (balance < ethers.parseEther("0.01")) {
    console.log("Saldo insuficiente para pagar gás.");
    return;
  }

  const totalBonds = await contract.totalBonds();

  for (let id = 0; id < totalBonds; id++) {
    const bond = await contract.bonds(id);

    const now = Math.floor(Date.now() / 1000);
    const maturity = bond.issueDate + (bond.frequency * 30 * 24 * 60 * 60);

    const ipcaUpdated = await contract.latestIPCAtimestamp() > now - 24 * 60 * 60;

    if (now >= maturity && ipcaUpdated) {
      const tx = await contract.amortizeBond(id);
      await tx.wait();
      console.log(`Amortized bond ${id}`);
    }
  }
}
