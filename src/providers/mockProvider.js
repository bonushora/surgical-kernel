
import { Provider } from "./interfaces/provider.js";


export class MockProvider extends Provider {


    async execute(request){


        return {

            model:
            "mock-provider",

            content:
            `Resposta simulada para: ${request.prompt}`,

            timestamp:
            new Date().toISOString()

        };


    }


}
