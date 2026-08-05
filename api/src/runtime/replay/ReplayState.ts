export interface ReplayState {

    executionId:string;

    projectId:string;

    mode:
        "free"
        |
        "deterministic";

    request:string;

    state:string;

    reconstructed:boolean;

    eventCount:number;

}
