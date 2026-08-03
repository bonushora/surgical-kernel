export interface ExecutionResponse {

    result: unknown;

    decision:
    "ALLOW" |
    "REVIEW" |
    "BLOCK";

    risk: {

        score:number;

        classification:string;

    };

    audit:any;

    snapshot:any;

    replay:any;

}
