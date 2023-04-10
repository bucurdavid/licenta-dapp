import { AbiRegistry, Address, ResultsParser, SmartContract, TypedValue, U64Value } from "@multiversx/sdk-core/out";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { Offers } from "./interfaces";
import jsonData from "./abis/market-sc.abi.json"
import { marketContractAddress } from "./constants";




export class MarketSmartContract {
    readonly networkProvider = new ProxyNetworkProvider("https://devnet-gateway.multiversx.com");

    json = JSON.parse(JSON.stringify(jsonData));
    abiRegistry = AbiRegistry.create(this.json);
    contract = new SmartContract({ address: new Address(marketContractAddress), abi: this.abiRegistry });

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
                owner: offer.owner.bech32(),
                carTokenIdentifier: offer["car"]["token_identifier"].toString(),
                carNonce: offer["car"]["token_nonce"].toString(),
                carAmount: offer["car"]["amount"] as number,
                paymentTokenIdentifier: offer["wanted_payment"]["token_identifier"].toString(),
                paymentNonce: offer["wanted_payment"]["token_nonce"].toString(),
                paymentAmount: offer["wanted_payment"]["amount"] as number,
                status: offer["status"]["name"].toString(),
                quantity: offer.quantity as number,
            }));
            return offers;
        }
    }
}