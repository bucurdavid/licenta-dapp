/**
* This is an auto generated code. This code should not be modified since the file can be overwriten 
* if new genezio commands are executed.
*/
     
import { Remote } from "./remote"



export class MinterSmartContract {
    static remote = new Remote("http://127.0.0.1:8083/MinterSmartContract")

    static async checkAddressIsWhitelisted(address: string): Promise<any> {
        return await MinterSmartContract.remote.call("MinterSmartContract.checkAddressIsWhitelisted", address)  
  }

  static async getManufacturer(address: string): Promise<Manufacturer> {
        return await MinterSmartContract.remote.call("MinterSmartContract.getManufacturer", address)  
  }

  static async initializeManufacturer(senderAddress: IAddress, name: string): Promise<Transaction> {
        return await MinterSmartContract.remote.call("MinterSmartContract.initializeManufacturer", senderAddress, name)  
  }

  static async createModel(senderAddress: IAddress, collectionName: string, ticker: string): Promise<Transaction> {
        return await MinterSmartContract.remote.call("MinterSmartContract.createModel", senderAddress, collectionName, ticker)  
  }

  static async setLocalRoles(senderAddress: IAddress, tokenIdentifier: string): Promise<Transaction> {
        return await MinterSmartContract.remote.call("MinterSmartContract.setLocalRoles", senderAddress, tokenIdentifier)  
  }

  static async setTransferRole(senderAddress: IAddress, tokenIdentifier: string): Promise<Transaction> {
        return await MinterSmartContract.remote.call("MinterSmartContract.setTransferRole", senderAddress, tokenIdentifier)  
  }

  static async createVehicle(senderAddress: IAddress, vin: string, modelName: string, modelBuildYear: number, modelPlantCountry: string, media: string): Promise<Transaction> {
        return await MinterSmartContract.remote.call("MinterSmartContract.createVehicle", senderAddress, vin, modelName, modelBuildYear, modelPlantCountry, media)  
  }

  static async withdrawCars(senderAddress: IAddress, all: undefined): Promise<Transaction> {
        return await MinterSmartContract.remote.call("MinterSmartContract.withdrawCars", senderAddress, all)  
  }

  

}

export { Remote };
