import { Wallet, ethers } from "ethers";
import cron from "node-cron";
import { getAccumulatedIPCAContract, getMonthlyIPCAContract } from "../utils/getContract";
import { getPolBalance } from "../logic/getBalance";

function getLastDayOfCurrentMonth(): Date {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Cria o dia 1º do mês seguinte
  const firstOfNextMonth = new Date(year, month + 1, 1);

  // Subtrai 1 dia (em milissegundos)
  const lastDay = new Date(firstOfNextMonth.getTime() - 24 * 60 * 60 * 1000);

  return lastDay;
}

export async function updateIPCA(privateKey: string) {
  const now = new Date();
  if (now.getDate() !== 1) return;

  const wallet = new Wallet(privateKey);
  const provider = wallet.provider!;
  const accumulatedContract = getAccumulatedIPCAContract(wallet);
  const monthlyContract = getMonthlyIPCAContract(wallet);

  const balance = await getPolBalance(wallet.address, provider);
  const minBalance = ethers.parseEther("0.9");
  if (balance < minBalance) return;

  const oneDayAgo = Math.floor(Date.now() / 1000) - 86400;
  const lastDay = getLastDayOfCurrentMonth();
  const lastDayInSecs = Math.floor(lastDay.getTime() / 1000);

  const tx1 = await accumulatedContract.sendRequestIPCA(434, oneDayAgo, lastDayInSecs);
  const tx2 = await monthlyContract.sendRequestIPCA(438, oneDayAgo, lastDayInSecs);
  await tx1.wait();
  await tx2.wait();
  console.log("IPCA atualizado.");
}
