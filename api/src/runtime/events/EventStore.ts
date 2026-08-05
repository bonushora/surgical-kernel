import {
    ExecutionEvent
} from "./ExecutionEvent.js";


import {
    MemoryEventRepository
} from "./MemoryEventRepository.js";



const repository =
    new MemoryEventRepository();



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
