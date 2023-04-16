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

export interface HistoryData {
  odometerValues: number[]
  odometerTimestamps: number[]
  dtcCodes: string[][]
  dtcTimestamps: number[]
  incidents: boolean[]
  incidentTimestamps: number[]
};

export interface Car {
  tokenIdentifier: string
  nftImage: string
  collection: string
  nonce: number
  name: string
  make: string
  supply: number
  attributes: CarAttributes
  historyData: HistoryData
};



export class Car {
    static remote = new Remote("http://127.0.0.1:8083/Car")

    static async fromApi(tokenIdentifier: string, nonce: number): Promise<Car> {
        return await Car.remote.call("Car.fromApi", tokenIdentifier, nonce)  
  }

  static async fromApiResponse(payload: any): Promise<Car> {
        return await Car.remote.call("Car.fromApiResponse", payload)  
  }

  static async decodeAttributes(attributes: any): Promise<Partial<Car>> {
        return await Car.remote.call("Car.decodeAttributes", attributes)  
  }

  

}

export { Remote };
