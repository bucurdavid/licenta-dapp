import {
  AbiRegistry,
  Address,
  BooleanValue,
  ContractCallPayloadBuilder,
  ContractFunction,
  IAddress,
  ResultsParser,
  SmartContract,
  StringValue,
  TokenIdentifierValue,
  Transaction,
  U64Value,
} from '@multiversx/sdk-core/out'
import {ProxyNetworkProvider} from '@multiversx/sdk-network-providers/out'
import {HistoryData} from './interfaces'
import jsonData from './abis/car-data-sc.abi.json' // needs update
import {dataContractAddres} from './constants' //needs update

export class InformationSmartContract {
  readonly networkProvider = new ProxyNetworkProvider(
    'https://devnet-gateway.multiversx.com'
  )

  contract = new SmartContract({
    address: new Address(dataContractAddres),
    abi: AbiRegistry.create(jsonData),
  })

  async getInformation(tokenIdentifier: string, nonce: number) {
    const interaction = this.contract.methodsExplicit.viewCarData([
      new TokenIdentifierValue(tokenIdentifier),
      new U64Value(nonce),
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

      const historyData: HistoryData = {
        odometerValues: returnValue['odometer_values'] as number[],
        odometerTimestamps: returnValue['odometer_timestamps'] as number[],
        dtcCodes: returnValue['dtc_codes'] as string[][],
        dtcTimestamps: returnValue['dtc_timestamps'] as number[],
        incidents: returnValue['incidents'] as boolean[],
        incidentTimestamps: returnValue['incident_timestamps'] as number[],
      }

      return historyData
    }
  }

  addData(
    senderAddress: IAddress,
    tokenIdentifier: string,
    nonce: number,
    timestamp: number,
    odometerValue: number,
    dtcCodes: string[],
    incident: boolean
  ): Transaction {
    const dtc = dtcCodes.map((dtcCode) => new StringValue(dtcCode))

    const contractCallPayloadBuilder = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction('addData'))
      .addArg(new TokenIdentifierValue(tokenIdentifier))
      .addArg(new U64Value(nonce))
      .addArg(new U64Value(timestamp))
      .addArg(new U64Value(odometerValue))

    dtc.forEach((dtcCode) => contractCallPayloadBuilder.addArg(dtcCode))

    contractCallPayloadBuilder.addArg(new BooleanValue(incident))

    const addDataTx = new Transaction({
      value: 0,
      data: contractCallPayloadBuilder.build(),

      receiver: this.contract.getAddress(),
      sender: senderAddress,
      gasLimit: 19000000,
      chainID: 'D',
    })
    return addDataTx
  }

  addIncident(
    senderAddress: IAddress,
    tokenIdentifier: string,
    nonce: number,
    timestamp: number
  ): Transaction {
    const addIncidentTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('addIncident'))
        .addArg(new TokenIdentifierValue(tokenIdentifier))
        .addArg(new U64Value(nonce))
        .addArg(new U64Value(timestamp))
        .build(),

      receiver: this.contract.getAddress(),
      sender: senderAddress,
      gasLimit: 8000000,
      chainID: 'D',
    })
    return addIncidentTx
  }
}
