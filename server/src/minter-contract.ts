import { Address, AddressValue, ResultsParser } from "@multiversx/sdk-core/out";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { Contract } from "./contract";
import { Manufacturer, Model } from "./interfaces";

export class MinterSmartContract extends Contract {
    readonly networkProvider: ProxyNetworkProvider;

    constructor(
        address: Address,
        jsonData: any,
        networkProvider: ProxyNetworkProvider
    ) {
        super(address, !jsonData);
        this.networkProvider = networkProvider;
    }

    async checkAddressIsWhitelisted(address: string) {

        const interaction = this.contract.methodsExplicit.viewIsWhitelisted([
            new AddressValue(new Address(address)),
        ]);
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
                    isWhitelisted: returnValue as boolean,
                }
            }
        }
    }

    async getManufacturer(address: string) {
        const interaction = this.contract.methodsExplicit.viewManufacturer([
            new AddressValue(new Address(address)),
        ]);
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

            const models: Model[] = returnValue["models"].map((model: any) => ({
                name: model["name"],
                tokenIdentifier: model["token_identifier"]
            }));

            const manufacturer: Manufacturer = {
                name: returnValue["name"] as string,
                modes: models
            };

            return {
                manufacturer: manufacturer
            };
        }
    }
}

