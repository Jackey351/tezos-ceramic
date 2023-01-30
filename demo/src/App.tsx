import "./App.css";
import "./App.css";

import { DIDSession } from "did-session";
import { TezosWebAuth, getAccountId } from "@didtools/pkh-tezos";
import { DAppClient } from "@airgap/beacon-sdk";
import { CeramicClient } from "@ceramicnetwork/http-client";
import {
  ModelInstanceDocument,
  type ModelInstanceDocumentMetadataArgs,
} from "@ceramicnetwork/stream-model-instance";
import { StreamID } from "@ceramicnetwork/streamid";
import { ethers } from "ethers";
import { login } from "./login";
import { loadStreamsByModel } from "./api/loadStreamsByModel";

let tzProvider: DAppClient;

export interface DataverseProfile {
  name: string;
  description: string;
  image: {
    original: {
      src: string;
      mimeType?: string;
      width?: number;
      height?: number;
    };
  };
  background: {
    original: {
      src: string;
      mimeType?: string;
      width?: number;
      height?: number;
    };
  };
}

function App() {
  const handleTest = async () => {
    // if (!tzProvider) {
    //   tzProvider = new DAppClient({
    //     name: "my dapp",
    //   });
    // }
    // // await tzProvider.clearActiveAccount();

    // console.log({ tzProvider });

    // let activeAccount = await tzProvider.getActiveAccount();
    // let address;
    // let network;
    // console.log({ activeAccount });
    // if (activeAccount) {
    //   address = activeAccount.address;
    //   network = activeAccount.network.type;
    // } else {
    //   const permissions = await tzProvider.requestPermissions();
    //   console.log({ permissions });
    //   address = permissions.address;
    //   network = permissions.network.type;
    // }

    // console.log({ address });
    // console.log({ network });

    // const accountId = await getAccountId(tzProvider, address);
    // console.log({ accountId });
    // const authMethod = await TezosWebAuth.getAuthMethod(tzProvider, accountId);

    const profileModel =
      "kjzl6hvfrbw6ca387paeel0z42xq5ivcrheiox3i25rp0hps15r4w12tvr2l939";

    // const session = await DIDSession.authorize(authMethod, {
    //   resources: [`ceramic://*?model=${profileModel}`],
    // });
    // console.log({ session });
    // console.log({ signature: session.cacao.s?.s });

    // // //前端模拟验证签名
    // // await verifyTezosSignature(session.cacao, {});
    // // console.log("signature verified");

    // const ceramic = new CeramicClient(
    //   "https://local1.dataverseceramicdaemon.com"
    // );
    // ceramic.did = session.did;
    // console.log(ceramic);

    // const did = ceramic.did.parent;
    // console.log(did);
    // // if (did) midMetadataArgs["controller"] = did;

    // const provider = ethers.getDefaultProvider();
    // const signer = new ethers.Wallet(
    //   "871cc2b0f1e92b81a5af21c744b9787d1cd2a67bbbe2606e2dcf71ab692120bc",
    //   provider
    // );
    // const address = await signer.getAddress();
    const { ceramic } = await login(
      { resources: [`ceramic://*?model=${profileModel}`] }
      // provider
    );
    const did = ceramic.did!.parent;
    console.log(ceramic);

    // console.log(doc)

    const streams = await loadStreamsByModel({
      did,
      model: profileModel,
      ceramic,
    });
    console.log(streams);

    if (Object.keys(streams).length === 0) {
      const doc = await ModelInstanceDocument.create<DataverseProfile>(
        ceramic,
        {
          name: "test_name",
          description: "test_description",
          image: {
            original: {
              src: "https://i.seadn.io/gcs/files/4df295e05429b6e56e59504b7e9650b6.gif?w=500&auto=format",
            },
          },
          background: {
            original: {
              src: "https://i.seadn.io/gae/97v7uBu0TGycl_CT73Wds8T22sqLZISSszf4f4mCrPEv5yOLn840HZU4cIyEc9WNpxXhjcyKSKdTuqH7svb3zBfl1ixVtX5Jtc3VzA?w=500&auto=format",
            },
          },
        },
        {
          model: StreamID.fromString(profileModel),
        }
      );
      console.log(doc.content);
    } else {
      const doc = await ModelInstanceDocument.load<DataverseProfile>(
        ceramic,
        Object.keys(streams)[0]
      );

      await doc.replace({
        name: "test_name2",
        description: "test_description2",
        image: doc.content.image,
        background: doc.content.background,
      });

      console.log(doc.content);
    }

    // console.log(doc.content);
    // console.log(doc.content);

    // const doc = await TileDocument.create(ceramic, { foo: "bar" });
    // console.log(doc);
    // console.log(doc.id.toString());

    // const doc1 = await TileDocument.load(ceramic, doc.id.toString());
    // console.log(doc1);
    // console.log(doc1.state.content);
  };

  return (
    <div className="App">
      <button onClick={handleTest}>test</button>
    </div>
  );
}

export default App;
