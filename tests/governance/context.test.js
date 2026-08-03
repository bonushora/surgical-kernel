import { ContextBuilder }
from "../../src/context/contextBuilder.js";


const builder =
new ContextBuilder();



const result =
builder.build({

name:
"usuario",

role:
"developer",

password:
"123456",

token:
"private-token",

metrics:
{
score:100
}

});



console.log(
"CONTEXT ISOLATION:"
);


console.log(result);

