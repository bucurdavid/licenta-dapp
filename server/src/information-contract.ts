import { Address, ResultsParser, TokenIdentifierValue, U64Value } from "@multiversx/sdk-core/out";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { Contract } from "./contract";

export class InformationSmartContract extends Contract {
    readonly networkProvider: ProxyNetworkProvider;

    constructor(
        address: Address,
        jsonData: any,
        networkProvider: ProxyNetworkProvider
    ) {

        super(address, !jsonData);
        this.networkProvider = networkProvider;
    }

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

            return {
                data: {
                    odometerValues: returnValue["odometer_values"] as number[],
                    odometerTimestamps: returnValue["odometer_timestamps"] as number[],
                    dtcCodes: returnValue["dtc_codes"] as string[][],
                    dtcTimestamps: returnValue["dtc_timestamps"] as number[],
                    incidents: returnValue["incidents"] as boolean[],
                    incidentTimestamps: returnValue["incident_timestamps"] as number[],
                }
            }

        }
    }

}