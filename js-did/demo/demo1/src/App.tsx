import './App.css'

import { DIDSession } from 'did-session'
import { TezosWebAuth, getAccountId, verifyTezosSignature} from '@didtools/pkh-tezos'
import { DAppClient } from '@airgap/beacon-sdk'

const tzProvider = new DAppClient({ name: 'my dapp' })

function App() {
  const handleClick = async () => {
    let activeAccount = await tzProvider.getActiveAccount()
    if (!activeAccount) {
      const permissions = await tzProvider.requestPermissions()
      let activeAccount = permissions
    }
    console.log(activeAccount.publicKey)
    const address = await activeAccount.address
    console.log({ address })
    const accountId = await getAccountId(tzProvider, address)
    console.log({ accountId })
    const authMethod = await TezosWebAuth.getAuthMethod(tzProvider, accountId)

    const session = await DIDSession.authorize(authMethod, { resources: ['ceramic://*'] })
    console.log({ session })

    await verifyTezosSignature(session.cacao, {})
    console.log("signature verified")
  }

  return (
    <div className="App">
      <button onClick={handleClick}>click me</button>
    </div>
  )
}

export default App
