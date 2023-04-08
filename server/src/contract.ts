import {
    AbiRegistry,
    Address,
    SmartContract,
} from '@multiversx/sdk-core'

export class Contract {
    readonly contract: SmartContract;

    constructor(address: Address, jsonData: any) {
        const json = JSON.parse(JSON.stringify(jsonData))
        const abiRegistry = AbiRegistry.create(json)
        this.contract = new SmartContract({ address: address, abi: abiRegistry })
    }


}




