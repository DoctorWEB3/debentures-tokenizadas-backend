import { ethers } from "ethers";
import LinkABI from "../abis/abiLinkToken.json";
import RouterABI from "../abis/abiSubscription.json";
import dotenv from "dotenv";
dotenv.config();

const RPC_URL = process.env.INFURA_URL!;
const provider = new ethers.JsonRpcProvider(RPC_URL);

export async function checkSubscriptionLoaded(subscriptionId: number): Promise<{
  isActive: boolean;
  subscriptionBalanceLINK: string;
}> {
  const router = new ethers.Contract(process.env.SUBSCRIPTION_ADDRESS!, RouterABI, provider);
  
  const subscription = await router.getSubscription(subscriptionId);

  // Aqui está a extração explícita do campo 'balance'
  const balance: bigint = subscription.balance;
  const owner: string = subscription.owner;

  // Conversão para LINK legível (18 casas decimais)
  const subscriptionBalanceLINK = ethers.formatUnits(balance.toString(), 18);

  // Verifica se a subscription está ativa (tem saldo e dono válido)
  const isActive = balance > 0n && owner !== ethers.ZeroAddress;

  console.log(`📦 Subscription ID: ${subscriptionId}`);
  console.log(`👤 Dono: ${owner}`);
  console.log(`💰 Saldo exclusivo da subscription: ${subscriptionBalanceLINK} LINK`);
  console.log(`✅ Está ativa? ${isActive}`);

  return {
    isActive,
    subscriptionBalanceLINK,
  };
}