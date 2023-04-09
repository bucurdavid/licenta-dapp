/**
* This is an auto generated code. This code should not be modified since the file can be overwriten 
* if new genezio commands are executed.
*/
     
import { Remote } from "./remote"



export class MarketSmartContract {
    static remote = new Remote("http://127.0.0.1:8083/MarketSmartContract")

    static async getOffers(ids: number[]): Promise<any> {
        return await MarketSmartContract.remote.call("MarketSmartContract.getOffers", ids)  
  }

  

}

export { Remote };
