/**
* This is an auto generated code. This code should not be modified since the file can be overwriten 
* if new genezio commands are executed.
*/
     
import { Remote } from "./remote"

export interface Model {
  name: string
  tokenIdentifier: string
};

export interface Manufacturer {
  name: string
  models: Model[]
};



export class MinterSmartContract {
    static remote = new Remote("http://127.0.0.1:8083/MinterSmartContract")

    static async checkAddressIsWhitelisted(address: string): Promise<any> {
        return await MinterSmartContract.remote.call("MinterSmartContract.checkAddressIsWhitelisted", address)  
  }

  static async getContractAddress(): Promise<any> {
        return await MinterSmartContract.remote.call("MinterSmartContract.getContractAddress")  
  }

  static async getVehicles(tokenIdentifier: string): Promise<number[]> {
        return await MinterSmartContract.remote.call("MinterSmartContract.getVehicles", tokenIdentifier)  
  }

  static async getManufacturer(address: string): Promise<Manufacturer> {
        return await MinterSmartContract.remote.call("MinterSmartContract.getManufacturer", address)  
  }

  static async initializeManufacturer(senderAddress: string, name: string): Promise<any> {
        return await MinterSmartContract.remote.call("MinterSmartContract.initializeManufacturer", senderAddress, name)  
  }

  static async createModel(senderAddress: string, collectionName: string, ticker: string): Promise<any> {
        return await MinterSmartContract.remote.call("MinterSmartContract.createModel", senderAddress, collectionName, ticker)  
  }

  static async setLocalRoles(senderAddress: string, tokenIdentifier: string): Promise<any> {
        return await MinterSmartContract.remote.call("MinterSmartContract.setLocalRoles", senderAddress, tokenIdentifier)  
  }

  static async setTransferRole(senderAddress: string, tokenIdentifier: string): Promise<any> {
        return await MinterSmartContract.remote.call("MinterSmartContract.setTransferRole", senderAddress, tokenIdentifier)  
  }

  static async createVehicle(senderAddress: string, vin: string, modelName: string, modelBuildYear: number, modelPlantCountry: string, media: string): Promise<any> {
        return await MinterSmartContract.remote.call("MinterSmartContract.createVehicle", senderAddress, vin, modelName, modelBuildYear, modelPlantCountry, media)  
  }

  static async withdrawCars(senderAddress: string, all: boolean): Promise<any> {
        return await MinterSmartContract.remote.call("MinterSmartContract.withdrawCars", senderAddress, all)  
  }

  

}

export { Remote };
