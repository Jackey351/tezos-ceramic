import reactLogo from "./assets/react.svg";
import "./App.css";

import { DIDSession } from "did-session";
import { TezosWebAuth, getAccountId } from "@didtools/pkh-tezos";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { TileDocument } from '@ceramicnetwork/stream-tile'

function App() {
  const handleTest = async () => {
    const ethProvider = (window as any).ethereum;
    const addresses = await ethProvider.enable();
    const accountId = await getAccountId(ethProvider, addresses[0]);
    const authMethod = await TezosWebAuth.getAuthMethod(ethProvider, accountId);

    const session = await DIDSession.authorize(authMethod, {
      resources: ["ceramic://*"]
    });

    const ceramic = new CeramicClient("http://127.0.0.1:7007");
    ceramic.did = session.did;
    console.log(ceramic)

    const doc = await TileDocument.create(
      ceramic,
      { foo: 'bar' }
    )
    console.log(doc)
    console.log(doc.id.toString())

    const doc1 = await TileDocument.load(
      ceramic,
      doc.id.toString()
    )
    console.log(doc1)
  };

  return (
    <div className="App">
      <button onClick={handleTest}>test</button>
    </div>
  );
}

export default App;
