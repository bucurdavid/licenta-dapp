import {AbiRegistry, BinaryCodec} from '@multiversx/sdk-core/out'
import {numberToPaddedHex} from './utils'
import minterAbi from './abis/market-sc.abi.json'
import {InformationSmartContract} from './information-contract'
import {CarAttributes, HistoryData} from './config'

export class Car {
  tokenIdentifier: string = ''
  nftImage: string = ''
  collection: string = ''
  nonce: number = 0
  name: string = ''
  make: string = ''
  supply: number = 0
  attributes: CarAttributes = {} as CarAttributes
  historyData: HistoryData = {} as HistoryData

  static apiLink: string = 'https://devnet-api.multiversx.com'

  constructor(init?: Partial<Car>) {
    Object.assign(this, init)
  }

  static async fromApi(
    tokenIdentifier: string,
    nonce: number
  ): Promise<Partial<Car>> {
    const identifier = `${tokenIdentifier}-${numberToPaddedHex(nonce)}`
    console.log(identifier)
    const nftQuery = await fetch(`${Car.apiLink}/nfts/${identifier}`)
    const carOnNetwork = await nftQuery.json()
    const infoContract = new InformationSmartContract()
    const historyData = await infoContract.getInformation(
      tokenIdentifier,
      nonce
    )
    try {
      const car = new Car({
        tokenIdentifier: carOnNetwork['identifier'],
        nftImage: carOnNetwork['url'] ? carOnNetwork['url'] : '',
        collection: carOnNetwork['collection'] as string,
        nonce: carOnNetwork['nonce'] as number,
        name: carOnNetwork['name'] as string,
        make: carOnNetwork['name'].split(' ')[0],
        supply: carOnNetwork['supply'] as number,
        ...Car.decodeAttributes(carOnNetwork['attributes']),
        historyData: historyData,
      })
      return car
    } catch {
      throw new Error('Car not found')
    }
  }

  static async fromApiResponse(payload: any): Promise<Car> {
    const identifier = payload['identifier']
    const nonce = payload['nonce'] as number
    const infoContract = new InformationSmartContract()
    const historyData = await infoContract.getInformation(identifier, nonce)
    try {
      const car = new Car({
        tokenIdentifier: identifier,
        nftImage: payload['url'] ? payload['url'] : '',
        collection: payload['collection'] as string,
        nonce: nonce,
        name: payload['name'] as string,
        make: payload['name'].split(' ')[0],
        supply: payload['supply'] as number,
        ...Car.decodeAttributes(payload['attributes']),
        historyData: historyData,
      })
      return car
    } catch {
      throw new Error('Car not found')
    }
  }

  static decodeAttributes(attributes: any): Partial<Car> {
    const codec = new BinaryCodec()
    const abiRegistry = AbiRegistry.create(minterAbi)
    const attr = abiRegistry.getStruct('CarAttributes')

    try {
      const decodedAttributes = codec
        .decodeTopLevel(Buffer.from(attributes, 'base64'), attr)
        .valueOf()

      const carAttributes: CarAttributes = {
        vin: decodedAttributes['vin'].toString(),
        name: decodedAttributes['name'].toString(),
        buildYear: decodedAttributes['build_year'].toNumber(),
        plantCountry: decodedAttributes['plant_country'].toString(),
        lastOdometerValue: decodedAttributes['last_odometer_value'].toNumber(),
        lastOdometerTimestamp:
          decodedAttributes['last_odometer_timestamp'].toNumber(),
      }
      return {attributes: carAttributes}
    } catch {
      throw new Error('Could not decode attributes')
    }
  }
}
