/**
* This is an auto generated code. This code should not be modified since the file can be overwriten 
* if new genezio commands are executed.
*/
     
import { Remote } from "./remote"



export class Car {
    static remote = new Remote("http://127.0.0.1:8083/Car")

    static async fromApi(tokenIdentifier: string, nonce: number): Promise<Partial<Car>> {
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
