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

action:"delete_database",

prompt:"Excluir registros"

})
);
