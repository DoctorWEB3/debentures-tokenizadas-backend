// src/tasks/mineTokens.ts
import puppeteer, { Page } from "puppeteer";
import { ethers } from "ethers";
import ABI from "../abis/abiattorneycoin.json";


const FAUCET_URL = "https://faucets.chain.link/";

const POL_CARD_ID = "faucet_card_polygon-amoy_native";
const LINK_CARD_ID = "faucet_card_polygon-amoy_link";

/**
 * Lógica comum para minerar tokens na página da Chainlink Faucet
 */
async function mineFromFaucet(walletAddress: string, cardTestId: string, tokenName: string) {
  try {
    console.log(`🚰 Minerando ${tokenName} para ${walletAddress}...`);

    const browser = await puppeteer.launch({ headless: true });
    const page: Page = await browser.newPage();
    await page.goto(FAUCET_URL, { waitUntil: "networkidle0" });

    // Clica no card específico (POL ou LINK)
    await page.waitForSelector(`[data-testid="${cardTestId}"]`);
    await page.click(`[data-testid="${cardTestId}"]`);

    // Preenche o endereço da carteira
    await page.waitForSelector('input[type="text"]');
    await page.type('input[type="text"]', walletAddress, { delay: 100 });

    // Clica no botão "Send request"
    await page.waitForSelector('[data-testid="request_button"]');
    await page.click('[data-testid="request_button"]');

    // Aguarda 8 segundos
    await new Promise((resolve) => setTimeout(resolve, 8000));
    await browser.close();

    console.log(`✅ Requisição de ${tokenName} enviada com sucesso.`);
  } catch (err) {
    console.error(`❌ Erro ao minerar ${tokenName}:`, err);
  }
}

/**
 * Mina POL (token nativo da rede Amoy)
 */
export async function minePOL(walletAddress: string) {
  await mineFromFaucet(walletAddress, POL_CARD_ID, "POL");
}

/**
 * Mina LINK (token ERC20 na rede Amoy)
 */
export async function mineLINK(walletAddress: string) {
  await mineFromFaucet(walletAddress, LINK_CARD_ID, "LINK");
}

const ATC_ADDRESS = `${process.env.PAYMENT_TOKEN_ADDRESS}`;
const PRIVATE_KEY = process.env.SECRET!;
const RPC_URL = process.env.INFURA_URL!;

export async function mintATC() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  const contract = new ethers.Contract(ATC_ADDRESS, ABI, signer);

  const tx = await contract.mint(); // ou contract.mint(to, amount) se necessário
  await tx.wait();

  console.log("ATC mintado com sucesso!");
}