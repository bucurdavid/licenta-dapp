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

  static async addData(senderAddress: IAddress, tokenIdentifier: string, nonce: number, timestamp: number, odometerValue: number, dtcCodes: string[], incident: boolean): Promise<Transaction> {
        return await InformationSmartContract.remote.call("InformationSmartContract.addData", senderAddress, tokenIdentifier, nonce, timestamp, odometerValue, dtcCodes, incident)  
  }

  static async addIncident(senderAddress: IAddress, tokenIdentifier: string, nonce: number, timestamp: number): Promise<Transaction> {
        return await InformationSmartContract.remote.call("InformationSmartContract.addIncident", senderAddress, tokenIdentifier, nonce, timestamp)  
  }

  

}

export { Remote };
