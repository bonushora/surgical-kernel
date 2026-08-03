export class ProviderInterface {

    async execute(request){

        throw new Error(
            "Provider deve implementar execute()"
        );

    }

}
