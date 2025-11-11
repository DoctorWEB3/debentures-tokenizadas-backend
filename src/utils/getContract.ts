// utils/getContract.ts
import { ethers, Network } from "ethers";
import artifacts from "../abis/abiBondAmortization.json";  // Ajuste se ABIs forem diferentes
import dotenv from "dotenv";
dotenv.config();

// Defina a rede Amoy explicitamente
const amoyNetwork = new Network("amoy", 80002);  // Nome custom + chainId

// Slug Infura para Amoy (obrigatório para endpoint correto)
const INFURA_AMOY_SLUG = "polygon-amoy";

function getDefaultProvider(): ethers.Provider {
  if (!process.env.INFURA_API_KEY) {
    throw new Error("INFURA_API_KEY não está definida no .env");
  }
  return new ethers.InfuraProvider(amoyNetwork, process.env.INFURA_API_KEY);
}


export function getAmortizationContract(provider?: ethers.Provider | ethers.Signer): ethers.Contract {
  const usedProvider = provider || getDefaultProvider();
  return new ethers.Contract(
    process.env.BOND_AMORTIZATION_ADDRESS!,
    artifacts,
    usedProvider
  );
}

export function getAccumulatedIPCAContract(provider?: ethers.Provider | ethers.Signer): ethers.Contract {
  const usedProvider = provider || getDefaultProvider();
  return new ethers.Contract(
    process.env.ACCUMULATED_ADDRESS!,
    artifacts,  // Ajuste ABI se necessário
    usedProvider
  );
}

export function getMonthlyIPCAContract(provider?: ethers.Provider | ethers.Signer): ethers.Contract {
  const usedProvider = provider || getDefaultProvider();
  return new ethers.Contract(
    process.env.MONTHLY_ADDRESS!,
    artifacts,  // Ajuste ABI se necessário
    usedProvider
  );
}

export function getMintingContract(provider?: ethers.Provider | ethers.Signer): ethers.Contract {
  const usedProvider = provider || getDefaultProvider();
  return new ethers.Contract(
    process.env.MINTING_ADDRESS!,
    artifacts,  // Ajuste ABI se necessário
    usedProvider
  );
}