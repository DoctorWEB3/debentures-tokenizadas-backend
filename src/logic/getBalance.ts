import { ethers } from "ethers";
import LinkABI from "../abis/abiLinkToken.json";
import AttorneycoinABI from "../abis/abiattorneycoin.json";

export async function getLinkBalance(address: string, provider: ethers.Provider): Promise<bigint> {
  const LINK = process.env.LINK_TOKEN!;
  const contract = new ethers.Contract(LINK, LinkABI, provider);
  return await contract.balanceOf(address);
}

export async function getAttorneycoinBalance(address: string, provider: ethers.Provider): Promise<bigint> {
  const POL = process.env.POL_TOKEN!;
  const contract = new ethers.Contract(POL, AttorneycoinABI, provider);
  return await contract.balanceOf(address);
}

export async function getPolBalance(address: string, provider: ethers.Provider): Promise<bigint> {
  return await provider.getBalance(address);
}