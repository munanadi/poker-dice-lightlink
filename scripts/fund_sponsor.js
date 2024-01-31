const ethers = require("ethers");
const airnodeAdmin = require("@api3/airnode-admin");
require("dotenv").config();

async function main() {
  // Airnode Parameters
  // https://docs.api3.org/reference/qrng/providers.html

  const airnodeAddress = "0x6238772544f029ecaBfDED4300f13A3c4FE84E1D";
  const airnodeXpub =
    "xpub6CuDdF9zdWTRuGybJPuZUGnU4suZowMmgu15bjFZT2o6PUtk4Lo78KGJUGBobz3pPKRaN9sLxzj21CMe6StP3zUsd8tWEJPgZBesYBMY7Wo";
  const yourDeployedContractAddress =
    "0x7b0488ca18d75b9D41941B113B53b7698D6A7225";
  const amountInEther = 0.1;

  // Connect to a provider (e.g., Infura, Alchemy)
  const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);

  // Use your private key (keep this secure!)
  const privateKey = process.env.PRIVATE_KEY;
  const wallet = new ethers.Wallet(privateKey, provider);

  // We are deriving the sponsor wallet address from the RrpRequester contract address
  // using the @api3/airnode-admin SDK. You can also do this using the CLI
  // https://docs.api3.org/airnode/latest/reference/packages/admin-cli.html
  // Visit our docs to learn more about sponsors and sponsor wallets
  // https://docs.api3.org/airnode/latest/concepts/sponsor.html
  const sponsorWalletAddress = await airnodeAdmin.deriveSponsorWalletAddress(
    airnodeXpub,
    airnodeAddress,
    yourDeployedContractAddress,
  );

  console.log(`Sponsor wallet address: ${sponsorWalletAddress}`);

  const receipt = await wallet.sendTransaction({
    to: sponsorWalletAddress,
    value: ethers.parseEther(amountInEther.toString()),
  });
  console.log(
    `Funding sponsor wallet at ${sponsorWalletAddress} with ${amountInEther} ...`,
  );

  let txReceipt = await receipt.wait();
  if (txReceipt.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log("Sponsor wallet funded");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
