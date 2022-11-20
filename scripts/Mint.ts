import { BigNumber, ethers } from "ethers";
import * as dotenv from "dotenv";
import { ElevenToken__factory } from "../typechain-types";
dotenv.config();

const MINT_VALUE = ethers.utils.parseEther("1");

// MINTING TOKENS FOR THE VOTER/SIGNER
async function main() {
  const contractAddress = process.argv[2];

  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
    infura: process.env.INFURA_API_KEY,
  });
  const wallet = new ethers.Wallet(process.env.KEY ?? "");
  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(`Connected to the wallet of ${signer.address}`);
  console.log(`The signer has a balance of ${balance} wei.`);

  console.log(`Attaching to contract: ${contractAddress}\n`);
  const contractFactory = new ElevenToken__factory(signer);
  const contract = await contractFactory.attach(contractAddress);

  console.log(
    `Connected to contract at address ${contract.address},
    with a token name of ${await contract.name()},
    and a token symbol of ${await contract.symbol()},
    and a total supply of ${(await contract.totalSupply()).toString()} decimals
    `
  );

  let signerTokenBalance = await contract.balanceOf(signer.address);
  console.log(`The signer starts with ${signerTokenBalance} balance`);
  console.log(`Minting...`);
  const mintTx = await contract.mint(signer.address, MINT_VALUE);
  await mintTx.wait();
  signerTokenBalance = await contract.balanceOf(signer.address);
  console.log(`The signer now has ${signerTokenBalance} balance`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
