
export class MockProvider {


async execute(request){


return {

model:"mock-provider",

content:
`Resposta simulada para: ${request.prompt}`,

timestamp:
new Date().toISOString()

};


}


}

