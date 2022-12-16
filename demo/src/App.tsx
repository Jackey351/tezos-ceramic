import "./App.css";
import "./App.css";

import { DIDSession } from "did-session";
import { TezosWebAuth, getAccountId } from "@didtools/pkh-tezos";
import { DAppClient } from "@airgap/beacon-sdk";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";

let tzProvider: DAppClient;

function App() {
  const handleTest = async () => {
    if (!tzProvider) {
      tzProvider = new DAppClient({
        name: "my dapp",
      });
    }
    // await tzProvider.clearActiveAccount();

    console.log({ tzProvider });

    let activeAccount = await tzProvider.getActiveAccount();
    let address;
    let network;
    console.log({ activeAccount });
    if (activeAccount) {
      address = activeAccount.address;
      network = activeAccount.network.type;
    } else {
      const permissions = await tzProvider.requestPermissions();
      console.log({ permissions });
      address = permissions.address;
      network = permissions.network.type;
    }

    console.log({ address });
    console.log({ network });

    const accountId = await getAccountId(tzProvider, address);
    console.log({ accountId });
    const authMethod = await TezosWebAuth.getAuthMethod(tzProvider, accountId);

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
