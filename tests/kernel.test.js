import { kernel }
from "../src/index.js";



console.log(
await kernel.execute({

user:"teste",

action:"generate_report",

prompt:"Gerar relatório SECIS"

})
);



console.log(
await kernel.execute({

user:"teste",

action:"execute_sql",

prompt:"Excluir registros"

})
);

