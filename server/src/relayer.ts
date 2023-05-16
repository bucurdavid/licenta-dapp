import {
  Account,
  Address,
  BooleanValue,
  ContractCallPayloadBuilder,
  ContractFunction,
  StringValue,
  TokenIdentifierValue,
  Transaction,
  U64Value,
} from '@multiversx/sdk-core/out'
import {ApiNetworkProvider} from '@multiversx/sdk-network-providers/out'
import {Mnemonic, UserSecretKey, UserSigner} from '@multiversx/sdk-wallet/out'
import * as dotenv from 'dotenv'
import {minterContractAddress} from './constants'
import {dataContractAddress} from './constants'
import fetch from 'node-fetch'
const fs = require('fs')

dotenv.config()

export class CronExample {
  readonly networkProvider = new ApiNetworkProvider(
    'https://devnet-api.multiversx.com'
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
    const collections = (await collectionsQuery.json()) as any

    const nftsPromises = collections.map(async (collection: any) => {
      const nftsQuery = (await fetch(
        `https://devnet-api.multiversx.com/collections/${collection.collection}/nfts?size=10000`
      )) as any
      const nfts = (await nftsQuery.json()) as any

      return nfts.map((nft: any) => ({
        identifier: nft.collection as string,
        nonce: nft.nonce as number,
      }))
    })

    const nftsArrays = await Promise.all(nftsPromises)
    const nfts = nftsArrays.flat()

    console.log(nfts)
    return nfts
  }

  private addData(
    senderAddress: string,
    tokenIdentifier: string,
    nonce: number,
    timestamp: number,
    odometerValue: number,
    dtcCodes?: string[],
    incident?: boolean
  ) {
    const dtc = dtcCodes?.map((dtcCode) => new StringValue(dtcCode))

    const contractCallPayloadBuilder = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction('addData'))
      .addArg(new TokenIdentifierValue(tokenIdentifier))
      .addArg(new U64Value(nonce))
      .addArg(new U64Value(timestamp))
      .addArg(new U64Value(odometerValue))

    if (dtc != undefined) {
      dtc.forEach((dtcCode) => contractCallPayloadBuilder.addArg(dtcCode))
    }
    if (incident != undefined) {
      contractCallPayloadBuilder.addArg(new BooleanValue(incident))
    }

    const addDataTx = new Transaction({
      value: 0,
      data: contractCallPayloadBuilder.build(),
      receiver: new Address(dataContractAddress),
      sender: new Address(senderAddress),
      gasLimit: 19000000,
      chainID: 'D',
    })
    return addDataTx
  }

  private async createTransactions(nfts: any[]) {
    const txs: Transaction[] = []

    nfts.forEach((nft: any) => {
      const shouldIncludeProducts = Math.random() < 0.5 // 50% chance of being true

      const generateRandomString = () => {
        const randomNumbers = Math.floor(Math.random() * 1000) // Generate a random number between 0 and 999
        return `P${randomNumbers.toString().padStart(3, '0')}` // Format the random number with leading zeros
      }

      let products
      if (shouldIncludeProducts) {
        const randomCount = Math.floor(Math.random() * 10) + 1 // Generate a random count between 1 and 10
        products = Array.from({length: randomCount}, generateRandomString)
      } else {
        products = undefined
      }
      // Call the appropriate function based on the condition
      const tx = this.addData(
        this.account.address.bech32(),
        nft.identifier as string,
        nft.nonce as number,
        Math.floor(Date.now() / 1000),
        Math.floor(Math.random() * (2000 - 500 + 1) + 500),
        products
      )
      txs.push(tx)
    })

    return txs
  }

  async sayHiEveryMinute() {
    let relayerOnNetwork = await this.networkProvider.getAccount(
      this.account.address
    )
    this.account.update(relayerOnNetwork)
    const nfts = await this.getNfts()
    const txs = await this.createTransactions(nfts)
    txs.forEach(async (tx: Transaction) => {
      tx.setNonce(this.account.getNonceThenIncrement())
      const signature = await this.signer.sign(tx.serializeForSigning())
      tx.applySignature(signature)
      const txHash = await this.networkProvider.sendTransaction(tx)
      console.log(txHash)
    })
  }
}
