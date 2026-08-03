
import { kernel } from "../src/index.js";


const response =
await kernel.execute({

user:"teste",

prompt:
"Explique BônusHora Social"

});


console.log(response);

