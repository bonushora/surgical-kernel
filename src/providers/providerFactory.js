
import { MockProvider } from "./mockProvider.js";


export class ProviderFactory {


    static create(type="mock"){


        switch(type){


            case "mock":

                return new MockProvider();


            default:

                throw new Error(
                    `Provider não suportado: ${type}`
                );


        }


    }


}
