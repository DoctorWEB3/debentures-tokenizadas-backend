export async function updateIPCA(privateKey: string) {
  const now = new Date();
  if (now.getDate() !== 1) return;

  const wallet = new Wallet(privateKey);
  const contract = getContract(wallet);

  const balance = await checkBalance(wallet);
  if (balance.lt("10000000000000000")) return;

  const lastIPCA = await contract.latestIPCAtimestamp();
  const oneDayAgo = Math.floor(Date.now() / 1000) - 86400;

  if (lastIPCA > oneDayAgo) return;

  const tx = await contract.requestIPCA();
  await tx.wait();
  console.log("IPCA atualizado.");
}
