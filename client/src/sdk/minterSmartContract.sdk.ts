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

  static async getManufacturer(address: string): Promise<any> {
        return await MinterSmartContract.remote.call("MinterSmartContract.getManufacturer", address)  
  }

  

}

export { Remote };
