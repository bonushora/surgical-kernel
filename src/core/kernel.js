
import { RequestGateway } from "../gateway/requestGateway.js";
import { PolicyEngine } from "../policies/policyEngine.js";
import { MockProvider } from "../providers/mockProvider.js";
import { ResponseValidator } from "../validators/responseValidator.js";
import { AuditEngine } from "../audit/auditEngine.js";
import { SnapshotEngine } from "../snapshot/snapshotEngine.js";


export class SurgicalKernel {


    constructor(){

        this.gateway = new RequestGateway();

        this.policy = new PolicyEngine();

        this.provider = new MockProvider();

        this.validator = new ResponseValidator();

        this.audit = new AuditEngine();

        this.snapshot = new SnapshotEngine();

    }



    async execute(request){


        const session =
            this.gateway.process(request);



        this.policy.validate(
            session
        );



        const response =
            await this.provider.execute(
                session
            );



        this.validator.validate(
            response
        );



        const audit =
            this.audit.record({

                request: session,

                response

            });



        this.snapshot.create({

            audit

        });



        return response;


    }


}

