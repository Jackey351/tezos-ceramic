import reactLogo from "./assets/react.svg";
import "./App.css";
import "./App.css";

import { DIDSession } from "did-session";
import {
  TezosWebAuth,
  getAccountId,
  verifyTezosSignature,
} from "@didtools/pkh-tezos";
import { DAppClient } from "@airgap/beacon-sdk";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";

let tzProvider: DAppClient;

function App() {
  const handleTest = async () => {
    if (!tzProvider) {
      tzProvider = new DAppClient({ name: "my dapp" });
    }
    // const ethProvider = (window as any).ethereum;
    // const addresses = await ethProvider.enable();
    // const accountId = await getAccountId(ethProvider, addresses[0]);
    // const authMethod = await TezosWebAuth.getAuthMethod(ethProvider, accountId);

    // const session = await DIDSession.authorize(authMethod, {
    //   resources: ["ceramic://*"]
    // });

    let activeAccount = await tzProvider.getActiveAccount();
    if (!activeAccount) {
      const permissions = await tzProvider.requestPermissions();
      let activeAccount = permissions;
    }
    console.log({ publicKey: activeAccount!.publicKey });
    const address = activeAccount!.address;
    console.log({ address });
    const accountId = await getAccountId(tzProvider, address);
    console.log({ accountId });
    const authMethod = await TezosWebAuth.getAuthMethod(
      tzProvider,
      accountId,
      activeAccount!.publicKey
    );

    const session = await DIDSession.authorize(authMethod, {
      resources: ["ceramic://*"],
    });
    console.log({ session });
    console.log({ signature: session.cacao.s.s });

    // //前端模拟验证签名
    // await verifyTezosSignature(session.cacao, {});
    // console.log("signature verified");

    const ceramic = new CeramicClient("http://127.0.0.1:7007");
    ceramic.did = session.did;
    console.log(ceramic);

    const doc = await TileDocument.create(ceramic, { foo: "bar" });
    console.log(doc);
    console.log(doc.id.toString());

    const doc1 = await TileDocument.load(ceramic, doc.id.toString());
    console.log(doc1);
    console.log(doc1.state.content);
  };

  return (
    <div className="App">
      <button onClick={handleTest}>test</button>
    </div>
  );
}

export default App;
