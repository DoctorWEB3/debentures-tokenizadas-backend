// utils/getContract.ts
import { ethers } from "ethers";
import artifacts from "../abi.json";
import dotenv from "dotenv";
dotenv.config();

export function getContract(provider?: ethers.Provider | ethers.Signer): ethers.Contract {
  const defaultProvider = new ethers.InfuraProvider(
    process.env.NETWORK,
    process.env.INFURA_API_KEY
  );
  const usedProvider = provider || defaultProvider;
  return new ethers.Contract(
    process.env.CONTRACT_ADDRESS!,
    artifacts.abi,
    usedProvider
  );
}
