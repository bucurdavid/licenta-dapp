import {Mnemonic} from '@multiversx/sdk-wallet/out'

const fs = require('fs')

export const genereateSecretKey = async () => {
  let relayerKeys = Mnemonic.generate().deriveKey()
  console.log(relayerKeys.hex())
  fs.writeFileSync('.env', `RELAYER_SECRET=${relayerKeys.hex()}`)
}
