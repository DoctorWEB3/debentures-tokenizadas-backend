import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

// checkBalance.ts
export async function getBalance(address: string): Promise<bigint> {
  const provider = new ethers.InfuraProvider(
    process.env.NETWORK,
    process.env.INFURA_API_KEY
  );
  return await provider.getBalance(address);
}
