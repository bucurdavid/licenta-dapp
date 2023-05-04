/**
* This is an auto generated code. This code should not be modified since the file can be overwriten 
* if new genezio commands are executed.
*/
     
import { Remote } from "./remote"



export class CronExample {
    static remote = new Remote("http://127.0.0.1:8083/CronExample")

    static async getNfts(): Promise<any> {
        return await CronExample.remote.call("CronExample.getNfts")  
  }

  static async createTransactions(nfts: any): Promise<any> {
        return await CronExample.remote.call("CronExample.createTransactions", nfts)  
  }

  

}

export { Remote };
