/**
* This is an auto generated code. This code should not be modified since the file can be overwriten 
* if new genezio commands are executed.
*/
     
import { Remote } from "./remote"



export class InformationSmartContract {
    static remote = new Remote("http://127.0.0.1:8083/InformationSmartContract")

    static async getInformation(tokenIdentifier: string, nonce: number): Promise<any> {
        return await InformationSmartContract.remote.call("InformationSmartContract.getInformation", tokenIdentifier, nonce)  
  }

  

}

export { Remote };
