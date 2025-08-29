// utils/getContract.ts
import { ethers } from "ethers";
import artifacts from "../abis/abiBondAmortization.json";
import dotenv from "dotenv";
dotenv.config();

export function getAmortizationContract(provider?: ethers.Provider | ethers.Signer): ethers.Contract {
  const defaultProvider = new ethers.InfuraProvider(
    process.env.NETWORK,
    process.env.INFURA_API_KEY
  );
  const usedProvider = provider || defaultProvider;
  return new ethers.Contract(
    process.env.BOND_AMORTIZATION_ADDRESS!,
    artifacts,
    usedProvider
  );
}

export function getAccumulatedIPCAContract(provider?: ethers.Provider | ethers.Signer): ethers.Contract {
  const defaultProvider = new ethers.InfuraProvider(
    process.env.NETWORK,
    process.env.INFURA_API_KEY
  );
  const usedProvider = provider || defaultProvider;
  return new ethers.Contract(
    process.env.ACCUMULATED_ADDRESS!,
    artifacts,
    usedProvider
  );
}

export function getMonthlyIPCAContract(provider?: ethers.Provider | ethers.Signer): ethers.Contract {
  const defaultProvider = new ethers.InfuraProvider(
    process.env.NETWORK,
    process.env.INFURA_API_KEY
  );
  const usedProvider = provider || defaultProvider;
  return new ethers.Contract(
    process.env.MONTHLY_ADDRESS!,
    artifacts,
    usedProvider
  );
}

export function getMintingContract(provider?: ethers.Provider | ethers.Signer): ethers.Contract {
  const defaultProvider = new ethers.InfuraProvider(
    process.env.NETWORK,
    process.env.INFURA_API_KEY
  );
  const usedProvider = provider || defaultProvider;
  return new ethers.Contract(
    process.env.MINTING_ADDRESS!,
    artifacts,
    usedProvider
  );
}
