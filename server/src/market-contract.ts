import { AbiRegistry, Address, ResultsParser, SmartContract, U64Value } from "@multiversx/sdk-core/out";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { Offers } from "./interfaces";
import jsonData from "./abis/minter-sc.abi.json" //needs change
import { minterContractAddress } from "./constants"; //needs change




export class MarketSmartContract {
    readonly networkProvider = new ProxyNetworkProvider("https://devnet-gateway.multiversx.com");

    json = JSON.parse(JSON.stringify(jsonData));
    abiRegistry = AbiRegistry.create(this.json);
    contract = new SmartContract({ address: new Address(minterContractAddress), abi: this.abiRegistry });

    async getOffers(ids: number[]) {
        const u64Ids = ids.map(id => new U64Value(id))
        const interaction = this.contract.methodsExplicit.viewOffers(u64Ids);
        const query = interaction.buildQuery();
        const queryResponse = await this.networkProvider.queryContract(query);
        const endpointDefinition = interaction.getEndpoint();
        const { firstValue, returnCode } = new ResultsParser().parseQueryResponse(
            queryResponse,
            endpointDefinition
        );
        if (returnCode.isSuccess()) {
            const returnValue = firstValue?.valueOf();
            console.log(returnValue);
            const offers: Offers[] = returnValue.map((offer: any) => ({
                owner: offer.owner,
                carTokenIdentifier: offer.carTokenIdentifier,
                carNonce: offer.carNonce,
                carAmount: offer.carAmount,
                paymentTokenIdentifier: offer.paymentTokenIdentifier,
                paymentNonce: offer.paymentNonce,
                paymentAmount: offer.paymentAmount,
                status: offer.status,
                quantity: offer.quantity
            }));
            return offers;
        }
    }
}