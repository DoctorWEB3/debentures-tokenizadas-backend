// src/tasks/mineTokens.ts
import { ethers } from "ethers";
import nodemailer from "nodemailer";
import ABI from "../abis/abiattorneycoin.json";

// Endereços e configs
const ATC_ADDRESS = process.env.PAYMENT_TOKEN_ADDRESS!;
const PRIVATE_KEY = process.env.SECRET!;
const RPC_URL = process.env.INFURA_URL!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_EMAIL_PASSWORD = process.env.ADMIN_EMAIL_PASSWORD!;

/**
 * Função utilitária para enviar alerta por e-mail
 */
async function notifyAdminByEmail(tokenName: string, walletAddress: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: ADMIN_EMAIL,
      pass: ADMIN_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Sistema de Debêntures" <${ADMIN_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `⚠️ Requisição manual: Carregar ${tokenName} para ${walletAddress}`,
    html: `
      <p>Foi detectada necessidade de carregar <strong>${tokenName}</strong> para a carteira <code>${walletAddress}</code>.</p>
      <p>⏳ Por favor, providencie o envio em até <strong>48 horas</strong>.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📬 Alerta de saldo baixo enviado para o administrador (${tokenName})`);
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail de alerta:", error);
  }
}

/**
 * Em vez de minerar POL, envia alerta por e-mail
 */
export async function minePOL(walletAddress: string) {
  console.log("🚫 Minerar POL via faucet desativado.");
  await notifyAdminByEmail("POL (nativo)", walletAddress);
}

/**
 * Em vez de minerar LINK, envia alerta por e-mail
 */
export async function mineLINK(walletAddress: string) {
  console.log("🚫 Minerar LINK via faucet desativado.");
  await notifyAdminByEmail("LINK (ERC20)", walletAddress);
}

/**
 * Mint manual do token ATC via contrato
 */
export async function mintATC() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(ATC_ADDRESS, ABI, signer);

  const tx = await contract.mint(); // ou mint(to, amount)
  await tx.wait();

  console.log("✅ ATC mintado com sucesso!");
}
