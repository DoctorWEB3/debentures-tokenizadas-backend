import { ethers } from "ethers";
import abi from "./src/abibondstorage.json" assert { type: "json" };

// Dados
const CONTRACT_ADDRESS = `${import.meta.env.VITE_BONDSTORAGE_ADDRESS}`;
const RPC_URL = `${import.meta.env.VITE_POLYGONSCAN_API_KEY}`;
const PRIVATE_KEY = `${import.meta.env.VITE_SECRET}`;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

// Dados do bond
const bond = {
  isin: "BREMISDEB5H2",
  title: "Debênture Simples da Emissora EMISSORA - 2ª Série - Vencimento 2024",
  symbol: "EMISSORA02D",
  currency: "0x36b3260c58e0e3a79f67f436e794533c0052268d", // address do token
  denomination: ethers.parseUnits("10000000", 0), // Sem casas decimais
  interestRate: 3,
  frequency: 5,
  issueNumber: 0,
  issueDate: 0,
  maturityDate: 0,
  bondStatus: 0
};

// Função principal
async function main() {
  try {
    const tx = await contract.registerBond(
      bond.isin,
      bond.title,
      bond.symbol,
      bond.currency,
      bond.denomination,
      bond.interestRate,
      bond.frequency,
      bond.issueNumber,
      bond.issueDate,
      bond.maturityDate,
      bond.bondStatus
    );

    console.log("Transação enviada:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transação confirmada no bloco:", receipt.blockNumber);
  } catch (error) {
    console.error("Erro ao cadastrar o bond:", error);
  }
}

main();
