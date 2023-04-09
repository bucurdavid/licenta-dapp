import { AbiRegistry, Address, ResultsParser, SmartContract, TokenIdentifierValue, U64Value } from "@multiversx/sdk-core/out";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { HistoryData } from "./interfaces";
import jsonData from "./abis/car-data-sc.abi.json" // needs update
import { dataContractAddres } from "./constants"; //needs update

export class InformationSmartContract {
    readonly networkProvider = new ProxyNetworkProvider("https://devnet-gateway.multiversx.com");

    json = JSON.parse(JSON.stringify(jsonData));
    abiRegistry = AbiRegistry.create(this.json);
    contract = new SmartContract({ address: new Address(dataContractAddres), abi: this.abiRegistry });

    async getInformation(tokenIdentifier: string, nonce: number) {
        const interaction = this.contract.methodsExplicit.viewCarData([
            new TokenIdentifierValue(tokenIdentifier),
            new U64Value(nonce),
        ])
        const query = interaction.buildQuery();
        const queryResponse = await this.networkProvider.queryContract(query);
        const endpointDefinition = interaction.getEndpoint();
        const { firstValue, returnCode } = new ResultsParser().parseQueryResponse(
            queryResponse,
            endpointDefinition
        );
        if (returnCode.isSuccess()) {
            let returnValue = firstValue?.valueOf();
            console.log(returnValue);

            const historyData: HistoryData = {
                odometerValues: returnValue["odometer_values"] as number[],
                odometerTimestamps: returnValue["odometer_timestamps"] as number[],
                dtcCodes: returnValue["dtc_codes"] as string[][],
                dtcTimestamps: returnValue["dtc_timestamps"] as number[],
                incidents: returnValue["incidents"] as boolean[],
                incidentTimestamps: returnValue["incident_timestamps"] as number[],
            };

            return historyData;

        }
    }

}