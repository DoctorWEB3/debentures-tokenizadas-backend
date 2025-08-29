import { ethers, Wallet } from "ethers";
import LinkABI from "../abis/abiLinkToken.json";

export async function fundSubscription434(wallet: Wallet, subscriptionId: number, amount: bigint) {
  const LINK = new ethers.Contract(process.env.LINK_TOKEN!, LinkABI, wallet);
  const registry = process.env.SUBSCRIPTION_ADDRESS!;

  const tx = await LINK.transferAndCall(registry, amount, subscriptionId);
  await tx.wait();
  console.log(`✅ Subscription ${subscriptionId} carregado com ${ethers.formatEther(amount)} LINK`);
}

export async function fundSubscription438(wallet: Wallet, subscriptionId: number, amount: bigint) {
  const LINK = new ethers.Contract(process.env.LINK_TOKEN!, LinkABI, wallet);
  const registry = process.env.SUBSCRIPTION_ADDRESS!;

  const tx = await LINK.transferAndCall(registry, amount, subscriptionId);
  await tx.wait();
  console.log(`✅ Subscription ${subscriptionId} carregado com ${ethers.formatEther(amount)} LINK`);
}
