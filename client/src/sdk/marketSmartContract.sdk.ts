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

  static async getUserOffers(address: string): Promise<any> {
        return await MarketSmartContract.remote.call("MarketSmartContract.getUserOffers", address)  
  }

  static async getCarDetails(tokenIdentifier: string, tokenNonce: number): Promise<any> {
        return await MarketSmartContract.remote.call("MarketSmartContract.getCarDetails", tokenIdentifier, tokenNonce)  
  }

  static async addOffer(senderAddress: IAddress, carTokenIdentifier: string, carNonce: number, carAmount: number, paymentTokenIdentifier: string, paymentNonce: number, paymentAmount: number, status: CarStatus): Promise<Transaction> {
        return await MarketSmartContract.remote.call("MarketSmartContract.addOffer", senderAddress, carTokenIdentifier, carNonce, carAmount, paymentTokenIdentifier, paymentNonce, paymentAmount, status)  
  }

  static async changePrice(senderAddress: IAddress, offerId: number, newPrice: number): Promise<Transaction> {
        return await MarketSmartContract.remote.call("MarketSmartContract.changePrice", senderAddress, offerId, newPrice)  
  }

  static async cancelOffer(senderAddress: IAddress, offerId: number): Promise<Transaction> {
        return await MarketSmartContract.remote.call("MarketSmartContract.cancelOffer", senderAddress, offerId)  
  }

  static async acceptOffer(senderAddress: IAddress, offerId: number, price: number): Promise<Transaction> {
        return await MarketSmartContract.remote.call("MarketSmartContract.acceptOffer", senderAddress, offerId, price)  
  }

  

}

export { Remote };
