/**
* This is an auto generated code. This code should not be modified since the file can be overwriten 
* if new genezio commands are executed.
*/
     
import { Remote } from "./remote"

export interface CarAttributes {
  vin: string
  name: string
  buildYear: number
  plantCountry: string
  lastOdometerValue: number
  lastOdometerTimestamp: number
};

export interface Offer {
  owner: string
  carTokenIdentifier: string
  carNonce: number
  carAmount: number
  paymentTokenIdentifier: string
  paymentNonce: number
  paymentAmount: number
  status: CarStatus
  quantity: number
};

export enum CarStatus {
  New,
  SecondHand,
};



export class MarketSmartContract {
    static remote = new Remote("http://127.0.0.1:8083/MarketSmartContract")

    static async getContractAddress(): Promise<any> {
        return await MarketSmartContract.remote.call("MarketSmartContract.getContractAddress")  
  }

  static async getOffers(ids: number[]): Promise<any> {
        return await MarketSmartContract.remote.call("MarketSmartContract.getOffers", ids)  
  }

  static async getUserOffers(address: string): Promise<any> {
        return await MarketSmartContract.remote.call("MarketSmartContract.getUserOffers", address)  
  }

  static async getCarDetails(tokenIdentifier: string, tokenNonce: number): Promise<any> {
        return await MarketSmartContract.remote.call("MarketSmartContract.getCarDetails", tokenIdentifier, tokenNonce)  
  }

  static async addOffer(senderAddress: string, carTokenIdentifier: string, carNonce: number, carAmount: number, paymentTokenIdentifier: string, paymentNonce: number, paymentAmount: number, status: CarStatus): Promise<any> {
        return await MarketSmartContract.remote.call("MarketSmartContract.addOffer", senderAddress, carTokenIdentifier, carNonce, carAmount, paymentTokenIdentifier, paymentNonce, paymentAmount, status)  
  }

  static async changePrice(senderAddress: string, offerId: number, newPrice: number): Promise<any> {
        return await MarketSmartContract.remote.call("MarketSmartContract.changePrice", senderAddress, offerId, newPrice)  
  }

  static async cancelOffer(senderAddress: string, offerId: number): Promise<any> {
        return await MarketSmartContract.remote.call("MarketSmartContract.cancelOffer", senderAddress, offerId)  
  }

  static async acceptOffer(senderAddress: string, offerId: number, price: number): Promise<any> {
        return await MarketSmartContract.remote.call("MarketSmartContract.acceptOffer", senderAddress, offerId, price)  
  }

  

}

export { Remote };
