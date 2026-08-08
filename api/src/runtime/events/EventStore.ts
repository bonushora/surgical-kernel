import {
    ExecutionEvent
} from "./ExecutionEvent.js";


import {
    FileEventRepository
} from "./FileEventRepository.js";



const repository =
    new FileEventRepository();



export function appendEvent(
    event: ExecutionEvent
) {

    return repository.append(
        event
    );

}



export function getEvents(
    executionId:string
):ExecutionEvent[] {

    return repository.getEvents(
        executionId
    );

}
