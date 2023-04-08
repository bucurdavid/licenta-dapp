import { AbiRegistry, Address, AddressValue, ResultsParser, SmartContract, StringValue } from "@multiversx/sdk-core/out";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { Manufacturer, Model } from "./interfaces";
import jsonData from "./abis/minter-sc.abi.json"
import { minterContractAddress } from "./constants";

export class MinterSmartContract {
    readonly networkProvider = new ProxyNetworkProvider("https://devnet-gateway.multiversx.com");


    json = JSON.parse(JSON.stringify(jsonData));
    abiRegistry = AbiRegistry.create(this.json);
    contract = new SmartContract({ address: new Address(minterContractAddress), abi: this.abiRegistry });




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
                name: model["name"].toString(),
                tokenIdentifier: model["token_identifier"]
            }));

            const manufacturer: Manufacturer = {
                name: returnValue["name"].toString(),
                models: models
            };

            return {
                manufacturer
            };
        }
    }
}

