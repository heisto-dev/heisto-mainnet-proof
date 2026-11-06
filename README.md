# Heisto Mainnet Proof

Public, timestamped evidence for the deployed Heisto program and the real **Vault Keeper Mainnet** prize pool. No signing keys, private prompts, database exports or operator history.

Verified at **2026-11-06T05:50:43.063Z** on **Solana Mainnet**, finalized commitment.

## Live example
- [Agent](https://heisto.xyz/#sentinel-3544635135356959125)
- [Sentinel account](https://explorer.solana.com/address/CCsGeq1dXFzZUAgDFvLN4RmVQsfLkyY7q8Gwdu8jRfXt)
- [Heisto program](https://explorer.solana.com/address/FxqFvpptTRCeKCxCuxt86AJze6v16Vk9M8UZCQ8tJvbi)
- [Full public evidence](evidence/mainnet.json)
- [Public creation guide](docs/public-guide.html)

## Finalized receipts
- **program-deployment:** [5iqQnixGvh3XayYe8gw9cFxwn8727JrQkXVjRhdoA2r2yGUhTXkY34y3ehuoKGhZDMxPid1643gASgrdvvExLcfs](https://explorer.solana.com/tx/5iqQnixGvh3XayYe8gw9cFxwn8727JrQkXVjRhdoA2r2yGUhTXkY34y3ehuoKGhZDMxPid1643gASgrdvvExLcfs) · 2026-11-05T07:32:38.000Z · slot 465622182
- **initialize-and-fund:** [U96xZGwWWLKqqrbwVmyhGTLVjqcSNXSCpMMPvbkYm8E7DsBgQUgRSfc5WymsbDCHHTuAoTXThWE2sSdf4pGN2M8](https://explorer.solana.com/tx/U96xZGwWWLKqqrbwVmyhGTLVjqcSNXSCpMMPvbkYm8E7DsBgQUgRSfc5WymsbDCHHTuAoTXThWE2sSdf4pGN2M8) · 2026-11-05T08:29:59.000Z · slot 465638292
- **unpause:** [3VeZ4pz9kDCx2FF4aSN64Pmz2usmXD47yy1jZPrzXU3k4jyQRJvctoTRGPqrrZwTNBYmRP1eervheVm6Ff5fLSKJ](https://explorer.solana.com/tx/3VeZ4pz9kDCx2FF4aSN64Pmz2usmXD47yy1jZPrzXU3k4jyQRJvctoTRGPqrrZwTNBYmRP1eervheVm6Ff5fLSKJ) · 2026-11-05T08:38:23.000Z · slot 465640678
- **sentinel-creation:** [4xTdmpzFAmGnePVp5MFXtWyX8BZRyaDV2ZiButF69cJtjK72bn1rS4zWpQ9f2ykEcQ8XAkYpALZ7ag6KHPjYVtkL](https://explorer.solana.com/tx/4xTdmpzFAmGnePVp5MFXtWyX8BZRyaDV2ZiButF69cJtjK72bn1rS4zWpQ9f2ykEcQ8XAkYpALZ7ag6KHPjYVtkL) · 2026-11-06T04:47:37.000Z · slot 465980100

## Real funding
0.5 SOL prize + 0.00151384 SOL account deposit + 0.000009 SOL network fee = **0.50152284 SOL owner debit**. The final contract-deployment transaction's fee is not its total historical deployment cost and is not charged for each new agent.

## Contract bytecode
- Executable: true
- ProgramData: `4p1Fi2NFpqscAWcdBsrze3WgCW23HXdSnP8hgw2sFFwV`
- Byte count: 312584 (excluding the 45-byte loader metadata header)
- SHA-256: `1b22fc202819dbf42e24f54be2b7c20725aeca3118b8c2aeb11ad38fff8ca0f8`
- Upgrade authority: `8kAVnHKm756KgzyQAuU36TDitpDx4snQepXwStPpc9Sb` — **upgradeable, not immutable**
- Recorded binary comparison: match; **independent reproducible source build/audit: not claimed**

## Independently re-check (read-only)
```sh
node scripts/verify.mjs
```
Node 22+. The default is the public Mainnet RPC, which may rate-limit or lack historical receipt access. Optionally supply your own SOLANA_RPC_URL through your process environment; the script never prints it. It requires no wallet, provider key or database. No signing/broadcast code is present. If access fails or any immutable evidence differs, it exits nonzero rather than presenting simulated verification.

Program authority, pause and pool balances can change after this snapshot. The first funded agent has no paid attack/payout/refund proof at that snapshot. Inspect a fresh settlement receipt before claiming that an attack paid a prize.

MIT. Support/security: support@heisto.xyz. [Architecture](https://github.com/heisto-dev/heisto-docs).
