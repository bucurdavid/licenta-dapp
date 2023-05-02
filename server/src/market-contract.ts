import {
  AbiRegistry,
  Address,
  AddressValue,
  BigIntValue,
  ContractCallPayloadBuilder,
  ContractFunction,
  IAddress,
  ResultsParser,
  SmartContract,
  StringValue,
  TokenIdentifierValue,
  Transaction,
  U64Value,
  U8Value,
} from '@multiversx/sdk-core/out'
import {ProxyNetworkProvider} from '@multiversx/sdk-network-providers/out'
import jsonData from './abis/market-sc.abi.json'
import {marketContractAddress} from './constants'
import {BigNumber} from 'bignumber.js'

export interface CarAttributes {
  vin: string
  name: string
  buildYear: number
  plantCountry: string
  lastOdometerValue: number
  lastOdometerTimestamp: number
}

export interface Offer {
  owner: string
  carTokenIdentifier: string
  carNonce: number
  carAmount: number
  paymentTokenIdentifier: string
  paymentNonce: number
  paymentAmount: number
  status: CarStatus
  quantity: number
}

export interface OfferWithIndex {
  index: number
  offer: Offer
}

export enum CarStatus {
  New,
  SecondHand,
}

export class MarketSmartContract {
  readonly networkProvider = new ProxyNetworkProvider(
    'https://devnet-gateway.multiversx.com'
  )

  contract = new SmartContract({
    address: new Address(marketContractAddress),
    abi: AbiRegistry.create(jsonData),
  })

  async getContractAddress() {
    return this.contract.getAddress()
  }

  async getOffers(ids: number[]) {
    const u64Ids = ids.map((id) => new U64Value(id))
    const interaction = this.contract.methodsExplicit.viewOffers(u64Ids)
    const query = interaction.buildQuery()
    const queryResponse = await this.networkProvider.queryContract(query)
    const endpointDefinition = interaction.getEndpoint()
    const {firstValue, returnCode} = new ResultsParser().parseQueryResponse(
      queryResponse,
      endpointDefinition
    )
    if (returnCode.isSuccess()) {
      const returnValue = firstValue?.valueOf()
      console.log(returnValue)
      const offers: OfferWithIndex[] = returnValue.map(
        (item: {index: BigNumber; offer: any}) => ({
          index: item.index.toNumber(),
          offer: {
            owner: item.offer.owner.bech32(),
            carTokenIdentifier:
              item.offer['car']['token_identifier'].toString(),
            carNonce: item.offer['car']['token_nonce'].toNumber(),
            carAmount: item.offer['car']['amount'],
            paymentTokenIdentifier:
              item.offer['wanted_payment']['token_identifier'].toString(),
            paymentNonce:
              item.offer['wanted_payment']['token_nonce'].toNumber(),
            paymentAmount: item.offer['wanted_payment']['amount'],
            status: item.offer['status']['name'].toString(),
            quantity: item.offer.quantity.toNumber(),
          },
        })
      )
      return offers
    }
  }

  async getUserOffers(address: string) {
    const interaction = this.contract.methodsExplicit.viewUserOffers([
      new AddressValue(new Address(address)),
    ])
    const query = interaction.buildQuery()
    const queryResponse = await this.networkProvider.queryContract(query)
    const endpointDefinition = interaction.getEndpoint()
    const {firstValue, returnCode} = new ResultsParser().parseQueryResponse(
      queryResponse,
      endpointDefinition
    )
    if (returnCode.isSuccess()) {
      const returnValue = firstValue?.valueOf()
      console.log(returnValue)
      const offers: OfferWithIndex[] = returnValue.map(
        (item: {index: BigNumber; offer: any}) => ({
          index: item.index.toNumber(),
          offer: {
            owner: item.offer.owner.bech32(),
            carTokenIdentifier:
              item.offer['car']['token_identifier'].toString(),
            carNonce: item.offer['car']['token_nonce'].toNumber(),
            carAmount: item.offer['car']['amount'],
            paymentTokenIdentifier:
              item.offer['wanted_payment']['token_identifier'].toString(),
            paymentNonce:
              item.offer['wanted_payment']['token_nonce'].toNumber(),
            paymentAmount: item.offer['wanted_payment']['amount'],
            status: item.offer['status']['name'].toString(),
            quantity: item.offer.quantity.toNumber(),
          },
        })
      )
      return offers
    }
  }

  async getCarDetails(tokenIdentifier: string, tokenNonce: number) {
    const interaction = this.contract.methodsExplicit.viewCarDetails([
      new TokenIdentifierValue(tokenIdentifier),
      new U64Value(tokenNonce),
    ])
    const query = interaction.buildQuery()
    const queryResponse = await this.networkProvider.queryContract(query)
    const endpointDefinition = interaction.getEndpoint()
    const {firstValue, returnCode} = new ResultsParser().parseQueryResponse(
      queryResponse,
      endpointDefinition
    )
    if (returnCode.isSuccess()) {
      const returnValue = firstValue?.valueOf()
      console.log(returnValue)

      const carAttributes: CarAttributes = {
        vin: returnValue['vin'].toString(),
        name: returnValue['name'].toString(),
        buildYear: returnValue['build_year'] as number,
        plantCountry: returnValue['plant_country'].toString(),
        lastOdometerValue: returnValue['last_odometer_value'] as number,
        lastOdometerTimestamp: returnValue['last_odometer_timestamp'] as number,
      }

      return carAttributes
    }
  }

  addOffer(
    senderAddress: string,
    carTokenIdentifier: string,
    carNonce: number,
    carAmount: number,
    paymentTokenIdentifier: string,
    paymentNonce: number,
    paymentAmount: number,
    status: CarStatus
  ) {
    const addOfferTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('ESDTNFTTransfer'))
        .addArg(new TokenIdentifierValue(carTokenIdentifier))
        .addArg(new U64Value(carNonce))
        .addArg(new BigIntValue(carAmount))
        .addArg(new AddressValue(this.contract.getAddress()))
        .addArg(new StringValue('addOffer'))
        .addArg(new TokenIdentifierValue(paymentTokenIdentifier))
        .addArg(new U64Value(paymentNonce))
        .addArg(new BigIntValue(paymentAmount))
        .addArg(new U8Value(status))
        .build(),
      receiver: new Address(senderAddress),
      sender: new Address(senderAddress),
      gasLimit: 12000000,
      chainID: 'D',
    })
    return addOfferTx
  }

  changePrice(senderAddress: string, offerId: number, newPrice: number) {
    const changePriceTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('changePrice'))
        .addArg(new U64Value(offerId))
        .addArg(new BigIntValue(newPrice))
        .build(),
      receiver: this.contract.getAddress(),
      sender: new Address(senderAddress),
      gasLimit: 12000000,
      chainID: 'D',
    })
    return changePriceTx
  }

  cancelOffer(senderAddress: string, offerId: number) {
    const cancelOfferTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('cancelOffer'))
        .addArg(new U64Value(offerId))
        .build(),
      receiver: this.contract.getAddress(),
      sender: new Address(senderAddress),
      gasLimit: 12000000,
      chainID: 'D',
    })
    return cancelOfferTx
  }

  acceptOffer(senderAddress: string, offerId: number, price: number) {
    const acceptOfferTx = new Transaction({
      value: price,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('acceptOffer'))
        .addArg(new U64Value(offerId))
        .build(),
      receiver: this.contract.getAddress(),
      sender: new Address(senderAddress),
      gasLimit: 12000000,
      chainID: 'D',
    })
    return acceptOfferTx
  }
}
