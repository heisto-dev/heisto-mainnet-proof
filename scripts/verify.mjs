import fs from 'node:fs';
import { createHash } from 'node:crypto';
const proof = JSON.parse(fs.readFileSync(new URL('../evidence/mainnet.json', import.meta.url), 'utf8'));
const endpoint = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
let id = 0;
async function rpc(method, params = []) {
  const response = await fetch(endpoint, { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({jsonrpc:'2.0',id:++id,method,params}), signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error('RPC access failed');
  const data = await response.json();
  if (data.error) throw new Error('RPC method failed');
  return data.result;
}
function check(value, label) { if (!value) throw new Error(label); }
try {
  check(await rpc('getGenesisHash') === proof.genesisHash, 'Network mismatch');
  const addresses = [proof.program.address, proof.program.programDataAddress, proof.config.address, proof.sentinel.address];
  const result = await rpc('getMultipleAccounts', [addresses,{encoding:'base64',commitment:'finalized'}]);
  const [program,data,config,sentinel] = result.value;
  check(program && data && config && sentinel, 'Missing account');
  check(program.executable && program.owner === proof.program.loader && data.owner === proof.program.loader, 'Program ownership mismatch');
  const binary = Buffer.from(data.data[0],'base64');
  check(binary.readUInt32LE(0) === 3, 'ProgramData type mismatch');
  check(createHash('sha256').update(binary.subarray(45,45+proof.program.binaryBytes)).digest('hex') === proof.program.binarySha256, 'Program bytecode changed');
  const account = Buffer.from(sentinel.data[0],'base64');
  check(sentinel.owner === proof.program.address && config.owner === proof.program.address, 'Account owner mismatch');
  check(account.readBigUInt64LE(40).toString() === proof.sentinel.id, 'Sentinel ID mismatch');
  check(account.subarray(105,137).toString('hex') === proof.sentinel.instructionsHash, 'Instruction commitment mismatch');
  let receipts = 0;
  for (const t of proof.transactions) {
    const receipt = await rpc('getTransaction',[t.signature,{encoding:'json',commitment:'finalized',maxSupportedTransactionVersion:0}]);
    check(receipt && receipt.meta && receipt.meta.err === null && receipt.slot === t.slot, 'Receipt missing, failed or mismatched');
    check(receipt.meta.fee === t.feeLamports, 'Receipt fee mismatch');
    if (t.stage === 'sentinel-creation') check(receipt.meta.preBalances[0] - receipt.meta.postBalances[0] === t.ownerDebitLamports, 'Creation debit mismatch');
    receipts++;
  }
  const currentConfig = Buffer.from(config.data[0],'base64');
  const snapshotConfig = Buffer.from(proof.config.accountDataBase64,'base64');
  const snapshotSentinel = Buffer.from(proof.sentinel.accountDataBase64,'base64');
  const programBytes = Buffer.from(program.data[0],'base64');
  // Compare immutable identities byte-for-byte without importing a signing SDK.
  check(programBytes.readUInt32LE(0) === 2, 'Program account type mismatch');
  check(account.subarray(8,40).equals(snapshotSentinel.subarray(8,40)), 'Sentinel owner changed');
  const currentAuthority = binary.subarray(12,45);
  const authorityB58 = proof.program.upgradeAuthority;
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  function decode58(s) { let n=0n; for(const c of s){const v=alphabet.indexOf(c);check(v>=0,'Invalid public address');n=n*58n+BigInt(v);} let h=n.toString(16);if(h.length%2)h='0'+h;const bytes=n===0n?Buffer.alloc(0):Buffer.from(h,'hex');return Buffer.concat([Buffer.alloc((s.match(/^1*/)||[''])[0].length),bytes]); }
  check(programBytes.subarray(4,36).equals(decode58(proof.program.programDataAddress)), 'ProgramData pointer changed');
  check(binary[12] === 1 && currentAuthority.subarray(1).equals(decode58(authorityB58)), 'Upgrade authority changed');
  check(currentConfig.subarray(8,144).equals(snapshotConfig.subarray(8,144)), 'Configuration roles or cap changed');
  console.log(JSON.stringify({verifiedAtUtc:new Date().toISOString(),network:'mainnet-beta',finalizedReceipts:receipts,bytecodeMatches:true,authorityMatchesSnapshot:true,currentPaused:!!currentConfig[144],currentPoolLamports:account.readBigUInt64LE(64).toString(),currentStatus:account[80],transactionsSigned:0,transactionsSent:0},null,2));
} catch {
  console.error('Verification failed or historical RPC evidence is unavailable. No transactions were signed or sent. No credential values are printed.');
  process.exitCode=1;
}
