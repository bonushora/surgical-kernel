export class ExecutionResponse {

    constructor({

        result,
        decision,
        risk,
        audit,
        snapshot,
        replay

    }){

        this.result = result;
        this.decision = decision;
        this.risk = risk;
        this.audit = audit;
        this.snapshot = snapshot;
        this.replay = replay;

    }

}
