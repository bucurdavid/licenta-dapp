import {
  AbiRegistry,
  Address,
  AddressValue,
  BooleanValue,
  ContractCallPayloadBuilder,
  ContractFunction,
  ResultsParser,
  SmartContract,
  StringValue,
  TokenIdentifierValue,
  TokenTransfer,
  Transaction,
  U64Value,
} from '@multiversx/sdk-core/out'
import {ProxyNetworkProvider} from '@multiversx/sdk-network-providers/out'
import jsonData from './abis/minter-sc.abi.json'
import {minterContractAddress} from './constants'

export interface Model {
  name: string
  tokenIdentifier: string
}

export interface Manufacturer {
  name: string
  models: Model[]
}
export class MinterSmartContract {
  readonly networkProvider = new ProxyNetworkProvider(
    'https://devnet-gateway.multiversx.com'
  )

  readonly contract = new SmartContract({
    address: new Address(minterContractAddress),
    abi: AbiRegistry.create(jsonData),
  })

  async checkAddressIsWhitelisted(address: string) {
    const interaction = this.contract.methodsExplicit.viewIsWhitelisted([
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
      let returnValue = firstValue?.valueOf()
      console.log(returnValue)

      return returnValue
    }
  }

  getContractAddress() {
    return this.contract.getAddress()
  }

  async getVehicles(tokenIdentifier: string): Promise<number[]> {
    const interaction = this.contract.methodsExplicit.viewVehicles([
      new TokenIdentifierValue(tokenIdentifier),
    ])
    const query = interaction.buildQuery()

    const queryResponse = await this.networkProvider.queryContract(query)
    const endpointDefinition = interaction.getEndpoint()
    const {firstValue, returnCode} = new ResultsParser().parseQueryResponse(
      queryResponse,
      endpointDefinition
    )
    if (returnCode.isSuccess()) {
      let returnValue = firstValue?.valueOf()
      console.log(returnValue)

      return returnValue as number[]
    } else {
      return []
    }
  }

  async getManufacturer(address: string): Promise<Manufacturer> {
    const interaction = this.contract.methodsExplicit.viewManufacturer([
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
      let returnValue = firstValue?.valueOf()
      console.log(returnValue)

      const models: Model[] = returnValue['models'].map((model: any) => ({
        name: model['name'].toString(),
        tokenIdentifier: model['token_identifier'],
      }))

      const manufacturer: Manufacturer = {
        name: returnValue['name'].toString(),
        models: models,
      }

      return manufacturer
    } else {
      return {
        name: '',
        models: [],
      }
    }
  }

  initializeManufacturer(senderAddress: string, name: string) {
    const initManufacturer = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('initializeManufacturer'))
        .addArg(new StringValue(name))
        .build(),
      receiver: this.contract.getAddress(),
      sender: new Address(senderAddress),
      gasLimit: 12000000,
      chainID: 'D',
    })
    return initManufacturer
  }

  createModel(senderAddress: string, collectionName: string, ticker: string) {
    const createModel = new Transaction({
      value: TokenTransfer.egldFromAmount(0.05),
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('createModel'))
        .addArg(new StringValue(collectionName))
        .addArg(new StringValue(ticker))
        .build(),
      receiver: this.contract.getAddress(),
      sender: new Address(senderAddress),
      gasLimit: 12000000,
      chainID: 'D',
    })
    return createModel
  }

  setLocalRoles(senderAddress: string, tokenIdentifier: string) {
    const setLocalRoles = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('setLocalRoles'))
        .addArg(new StringValue(tokenIdentifier))
        .build(),
      receiver: this.contract.getAddress(),
      sender: new Address(senderAddress),
      gasLimit: 12000000,
      chainID: 'D',
    })
    return setLocalRoles
  }

  setTransferRole(senderAddress: string, tokenIdentifier: string) {
    const setTransferRole = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('setTransferRole'))
        .addArg(new StringValue(tokenIdentifier))
        .build(),
      receiver: this.contract.getAddress(),
      sender: new Address(senderAddress),
      gasLimit: 12000000,
      chainID: 'D',
    })
    return setTransferRole
  }

  createVehicle(
    senderAddress: string,
    vin: string,
    modelName: string,
    modelBuildYear: number,
    modelPlantCountry: string,
    media: string
  ) {
    const createVehicle = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('createVehicle'))
        .addArg(new StringValue(vin))
        .addArg(new StringValue(modelName))
        .addArg(new U64Value(modelBuildYear))
        .addArg(new StringValue(modelPlantCountry))
        .addArg(new StringValue(media))
        .build(),
      receiver: this.contract.getAddress(),
      sender: new Address(senderAddress),
      gasLimit: 12000000,
      chainID: 'D',
    })
    return createVehicle
  }

  withdrawCars(senderAddress: string, all: boolean) {
    const withdrawCars = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('withdrawCars'))
        .addArg(new BooleanValue(all))
        .build(),
      receiver: new Address(this.contract.getAddress().bech32().toString()),
      sender: new Address(senderAddress),
      gasLimit: 19000000,
      chainID: 'D',
    })
    return withdrawCars
  }
}
