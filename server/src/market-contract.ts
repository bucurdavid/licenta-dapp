import { Address, ResultsParser, U64Value } from "@multiversx/sdk-core/out";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { Contract } from "./contract";
import { Offers } from "./interfaces";





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