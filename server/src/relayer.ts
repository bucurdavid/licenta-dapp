import {Account, Transaction} from '@multiversx/sdk-core/out'
import {ProxyNetworkProvider} from '@multiversx/sdk-network-providers/out'
import {Mnemonic, UserSecretKey, UserSigner} from '@multiversx/sdk-wallet/out'
import * as dotenv from 'dotenv'
import {minterContractAddress} from './constants'
import {InformationSmartContract} from './information-contract'
const fs = require('fs')

dotenv.config()

export class CronExample {
  readonly networkProvider = new ProxyNetworkProvider(
    'https://devnet-gateway.multiversx.com'
  )
  readonly signer: UserSigner
  readonly account: Account

  constructor() {
    if (!process.env.RELAYER_SECRET) {
      this.generateSecretKey()
    }
    dotenv.config()
    const relayerSecrets = UserSecretKey.fromString(process.env.RELAYER_SECRET!)
    this.signer = new UserSigner(relayerSecrets)
    const relayerAddress = relayerSecrets.generatePublicKey().toAddress()
    console.log(relayerAddress.bech32())
    this.account = new Account(relayerAddress)
  }

  private generateSecretKey = async () => {
    let relayerKeys = Mnemonic.generate().deriveKey()
    console.log(relayerKeys.hex())
    fs.writeFileSync('.env', `RELAYER_SECRET=${relayerKeys.hex()}`)
  }

  private async getNfts() {
    const collectionsQuery = await fetch(
      `https://devnet-api.multiversx.com/accounts/${minterContractAddress}/roles/collections`
    )
    const collections = await collectionsQuery.json()

    const nftsPromises = collections.map(async (collection: any) => {
      const nftsQuery = await fetch(
        `https://devnet-api.multiversx.com/collections/${collection.collection}/nfts?size=10000`
      )
      const nfts = await nftsQuery.json()

      return nfts.map((nft: any) => ({
        identifier: nft.collection,
        none: nft.nonce,
      }))
    })

    const nftsArrays = await Promise.all(nftsPromises)
    const nfts = nftsArrays.flat()

    console.log(nfts)
    return nfts
  }

  private createTransactions(nfts: any) {
    const infoContract = new InformationSmartContract()
    const txs = nfts.forEach((nft: any) => {
      infoContract.addData(
        this.account.address.bech32(),
        nft.identifier,
        nft.number,
        Math.floor(Date.now() / 1000),
        Math.floor(Math.random() * (2000 - 500 + 1) + 500)
      )
    })
    return txs
  }

  async sayHiEveryMinute() {
    let relayerOnNetwork = await this.networkProvider.getAccount(
      this.account.address
    )
    this.account.update(relayerOnNetwork)
    const nfts = this.getNfts()
    const txs = this.createTransactions(nfts)
    txs.forEach((tx: Transaction) => {
      tx.setNonce(this.account.getNonceThenIncrement())
      const seandable = tx.toSendable()
      this.signer.sign(seandable)
      const txHash = this.networkProvider.sendTransaction(seandable)
      console.log(txHash)
    })
  }
}
