const faucets = [
  {
    name: "Polygon Faucet",
    url: "https://faucet.polygon.technology/",
    intervalHours: 12,
    lastUsed: 0,
  },
  // Adicione mais aqui
];

export async function mineTokens(walletAddress: string) {
  const now = Date.now();

  for (const faucet of faucets) {
    if (now - faucet.lastUsed < faucet.intervalHours * 3600 * 1000) continue;

    try {
      // Aqui você vai precisar implementar a lógica POST com o seu endereço
      // ou abrir via Puppeteer se for faucet baseado em navegador
      console.log(`Minerando em ${faucet.name} para ${walletAddress}`);
      // await axios.post(...) ou usar Puppeteer
      faucet.lastUsed = now;
    } catch (err) {
      console.error(`Erro ao minerar ${faucet.name}`, err);
    }
  }
}
