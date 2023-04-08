/**
* This is an auto generated code. This code should not be modified since the file can be overwriten 
* if new genezio commands are executed.
*/
     
import { Remote } from "./remote"



export class HelloWorldClass {
    static remote = new Remote("http://127.0.0.1:8083/HelloWorldClass")

    static async checkInternalServerHealth(): Promise<any> {
        return await HelloWorldClass.remote.call("HelloWorldClass.checkInternalServerHealth")  
  }

  

}

export { Remote };
