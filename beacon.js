
import { verifySignature } from "@taquito/utils";
import { DAppClient, SigningType } from '@airgap/beacon-sdk';
import { char2Bytes } from '@taquito/utils';

async function main() {
    const dAppClient = new DAppClient({ name: "ABC Dapp" });

    const accounts = await dAppClient.getAccounts();

    const bytes = char2Bytes("qwerqwerqwe");
    const payloadBytes = '05' + '0100' + char2Bytes(bytes.length.toString()) + bytes;

    const response = await dAppClient.requestSignPayload({
        signingType: SigningType.MICHELINE,
        payload: payloadBytes,
    });

    const pk = accounts[0].publicKey
    const sig = response.signature

    console.log(`message: ${payloadBytes}\npk: ${pk}\nsig: ${sig}`)

    let result = verifySignature(payloadBytes, pk, sig)
    console.log(result)
}

main()
