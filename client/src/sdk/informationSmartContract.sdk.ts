/**
* This is an auto generated code. This code should not be modified since the file can be overwriten 
* if new genezio commands are executed.
*/
     
import { Remote } from "./remote"

export interface HistoryData {
  odometerValues: number[]
  odometerTimestamps: number[]
  dtcCodes: string[][]
  dtcTimestamps: number[]
  incidents: boolean[]
  incidentTimestamps: number[]
};



export class InformationSmartContract {
    static remote = new Remote("http://127.0.0.1:8083/InformationSmartContract")

    static async getInformation(tokenIdentifier: string, nonce: number): Promise<any> {
        return await InformationSmartContract.remote.call("InformationSmartContract.getInformation", tokenIdentifier, nonce)  
  }

  static async addData(senderAddress: string, tokenIdentifier: string, nonce: number, timestamp: number, odometerValue: number, dtcCodes: string[], incident: boolean): Promise<any> {
        return await InformationSmartContract.remote.call("InformationSmartContract.addData", senderAddress, tokenIdentifier, nonce, timestamp, odometerValue, dtcCodes, incident)  
  }

  static async addIncident(senderAddress: string, tokenIdentifier: string, nonce: number, timestamp: number): Promise<any> {
        return await InformationSmartContract.remote.call("InformationSmartContract.addIncident", senderAddress, tokenIdentifier, nonce, timestamp)  
  }

  

}

export { Remote };
