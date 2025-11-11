import { ethers } from "ethers";
import LinkABI from "../abis/abiLinkToken.json";
import AttorneycoinABI from "../abis/abiattorneycoin.json";

export async function getLinkBalance(address: string, provider: ethers.Provider): Promise<bigint> {
  const LINK = process.env.LINK_TOKEN!;
  const contract = new ethers.Contract(LINK, LinkABI, provider);
  return await provider.getBalance(address);
}

export async function getAttorneycoinBalance(address: string, provider: ethers.Provider): Promise<bigint> {
  const ATC = process.env.PAYMENT_TOKEN_ADDRESS!;
  const contract = new ethers.Contract(ATC, AttorneycoinABI, provider);
  return await provider.getBalance(address);
}

export async function getPolBalance(address: string, provider: ethers.Provider): Promise<bigint> {
  return await provider.getBalance(address);
}