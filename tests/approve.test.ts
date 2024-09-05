import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo
} from "@solana/spl-token";
import { Approve } from "../target/types/approve";
import { randomBytes } from "crypto";

const getRandomBigNumber = (size: number = 8) => new BN(randomBytes(size));

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("token-exchange", () => {
  const provider = anchor.AnchorProvider.env();
  // Configure the client to use the local cluster
  anchor.setProvider(provider);

  const program = anchor.workspace.Approve;

  let mintATK: PublicKey;
  let mintBTK: PublicKey;
  let aliceTokenAccountATK: PublicKey;
  let bobTokenAccountBTK: PublicKey;
  let bobTokenAccountATK: PublicKey;
  let aliceTokenAccountBTK: PublicKey;

  const alice = Keypair.generate();
  const bob = Keypair.generate();

  const amountATK = 20;
  const amountBTK = 100;

  // Pick a random ID for the new offer
  const offerId = getRandomBigNumber();

  beforeAll(async () => {

    // Airdrop SOL to Alice and Bob
    await provider.connection.requestAirdrop(alice.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(bob.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await sleep(500)

    // Create ATK mint and associated token account for Alice
    mintATK = await createMint(provider.connection, alice, alice.publicKey, null, 0);
    aliceTokenAccountATK = (await getOrCreateAssociatedTokenAccount(provider.connection, alice, mintATK, alice.publicKey)).address;

    // Create BTK mint and associated token account for Bob
    mintBTK = await createMint(provider.connection, bob, bob.publicKey, null, 0);
    bobTokenAccountBTK = (await getOrCreateAssociatedTokenAccount(provider.connection, bob, mintBTK, bob.publicKey)).address;

  });

  it("Alice makes an offer to exchange ATK for BTK", async () => {
      await program.methods
      .makeOffer(
        offerId,
        new anchor.BN(amountATK)
      )
      .accounts({
        maker: alice.publicKey,
        atkMint: mintATK,
        btkMint: mintBTK,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([alice])
      .rpc();
  });
});