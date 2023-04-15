import {
  AbiRegistry,
  Address,
  AddressValue,
  ResultsParser,
  SmartContract,
  TokenIdentifierValue,
  U64Value,
} from '@multiversx/sdk-core/out'
import {ProxyNetworkProvider} from '@multiversx/sdk-network-providers/out'
import {CarAttributes, Offers} from './interfaces'
import jsonData from './abis/market-sc.abi.json'
import {marketContractAddress} from './constants'

export class MarketSmartContract {
  readonly networkProvider = new ProxyNetworkProvider(
    'https://devnet-gateway.multiversx.com'
  )

  contract = new SmartContract({
    address: new Address(marketContractAddress),
    abi: AbiRegistry.create(jsonData),
  })

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
      const offers: Offers[] = returnValue.map((offer: any) => ({
        owner: offer.owner.bech32(),
        carTokenIdentifier: offer['car']['token_identifier'].toString(),
        carNonce: offer['car']['token_nonce'].toString(),
        carAmount: offer['car']['amount'] as number,
        paymentTokenIdentifier:
          offer['wanted_payment']['token_identifier'].toString(),
        paymentNonce: offer['wanted_payment']['token_nonce'].toString(),
        paymentAmount: offer['wanted_payment']['amount'] as number,
        status: offer['status']['name'].toString(),
        quantity: offer.quantity as number,
      }))
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
      const offers: Offers[] = returnValue.map((offer: any) => ({
        owner: offer.owner.bech32(),
        carTokenIdentifier: offer['car']['token_identifier'].toString(),
        carNonce: offer['car']['token_nonce'].toString(),
        carAmount: offer['car']['amount'] as number,
        paymentTokenIdentifier:
          offer['wanted_payment']['token_identifier'].toString(),
        paymentNonce: offer['wanted_payment']['token_nonce'].toString(),
        paymentAmount: offer['wanted_payment']['amount'] as number,
        status: offer['status']['name'].toString(),
        quantity: offer.quantity as number,
      }))
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
}
