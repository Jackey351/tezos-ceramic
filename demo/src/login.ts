import { type CapabilityOpts } from "@ceramicnetwork/blockchain-utils-linking";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyDidResolver from "key-did-resolver";
import { randomString, randomBytes } from "@stablelib/random";
import { ethers } from "ethers";
import { SiweMessage, Cacao } from "ceramic-cacao";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { fromString as uint8ArrayfromString } from "uint8arrays/from-string";

declare global {
  interface Window {
    ethereum: any;
  }
}

export async function login(
  opts: CapabilityOpts = {},
  ethProvider?: any
): Promise<{
  ceramic: CeramicClient;
  sessionString: string;
}> {
  const provider = new ethers.providers.Web3Provider(
    ethProvider ?? window.ethereum
  );
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const { chainId } = await provider.getNetwork();

  // create temp did:key
  const keySeed = randomBytes(32);
  const didKey = await createDIDKey(keySeed);

  // generate siwe message
  const now = new Date();
  const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const capabilityOpts = {
    domain: opts.domain ?? window.location.hostname,
    address,
    statement:
      opts.statement ?? "Give this application access to some of your data",
    version: "1",
    uri: didKey.id,
    nonce: opts.nonce ?? randomString(10),
    issuedAt: now.toISOString(),
    expirationTime: opts.expirationTime ?? oneDayLater.toISOString(),
    chainId: String(chainId),
    resources: opts.resources ?? [],
  };

  const siweMessage = new SiweMessage(capabilityOpts);
  const message = siweMessage.toMessage();

  // sign siwe message
  const signature = await signer.signMessage(message);

  // create cacao object
  siweMessage.signature = signature;
  const cacao = Cacao.fromSiweMessage(siweMessage);

  // attach cacao to ceramic client
  const didKeyWithCap = didKey.withCapability(cacao);
  await didKeyWithCap.authenticate();

  const ceramic = new CeramicClient(
    "https://local1.dataverseceramicdaemon.com"
  );
  ceramic.did = didKeyWithCap;

  // export sessionString
  const sessionString = createSessionString(keySeed, cacao);

  // reuse siwe signature for lit protocol

  return { ceramic, sessionString };
}

function createSessionString(keySeed: Uint8Array, cacao: any): string {
  const session = {
    sessionKeySeed: uint8ArrayToString(keySeed, "base64pad"),
    cacao,
  };
  return uint8ArrayToString(
    uint8ArrayfromString(JSON.stringify(session)),
    "base64url"
  );
}

async function createDIDKey(seed?: Uint8Array): Promise<DID> {
  const didProvider = new Ed25519Provider(seed ?? randomBytes(32));
  const didKey = new DID({
    provider: didProvider,
    resolver: KeyDidResolver.getResolver(),
  });
  await didKey.authenticate();
  return didKey;
}
