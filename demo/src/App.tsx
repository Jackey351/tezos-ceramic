import "./App.css";
import "./App.css";
import { DIDSession } from "did-session";
import { TezosWebAuth, getAccountId } from "@didtools/pkh-tezos";
import { DAppClient } from "@airgap/beacon-sdk";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { ModelInstanceDocument } from "@ceramicnetwork/stream-model-instance";
import { StreamID } from "@ceramicnetwork/streamid";
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
    if (!tzProvider) {
      tzProvider = new DAppClient({
        name: "my dapp",
      });
    }
    // await tzProvider.clearActiveAccount();
    let activeAccount = await tzProvider.getActiveAccount();
    let address;
    let network;
    if (activeAccount) {
      address = activeAccount.address;
      network = activeAccount.network.type;
    } else {
      const permissions = await tzProvider.requestPermissions();
      console.log({ permissions });
      address = permissions.address;
      network = permissions.network.type;
    }

    const accountId = await getAccountId(tzProvider, address);
    const authMethod = await TezosWebAuth.getAuthMethod(tzProvider, accountId);

    const profileModel =
      "kjzl6hvfrbw6ca387paeel0z42xq5ivcrheiox3i25rp0hps15r4w12tvr2l939";

    const session = await DIDSession.authorize(authMethod, {
      resources: [`ceramic://*?model=${profileModel}`],
    });

    const ceramic = new CeramicClient(
      "https://local1.dataverseceramicdaemon.com"
    );
    ceramic.did = session.did;

    const did = ceramic.did.parent;

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
  };

  return (
    <div className="App">
      <button onClick={handleTest}>test</button>
    </div>
  );
}

export default App;
