import {
    ExecutionEvent
} from "./ExecutionEvent.js";


import {
    EventRepository
} from "./EventRepository.js";


import {
    FileEventRepository
} from "./FileEventRepository.js";



let repository:
    EventRepository =
    new FileEventRepository();



export function configureEventRepository(
    nextRepository: EventRepository
): void {

    repository =
        nextRepository;

}



export function appendEvent(
    event: ExecutionEvent
): ExecutionEvent {

    return repository.append(
        event
    );

}



export function getEvents(
    executionId: string
): ExecutionEvent[] {

    return repository.getEvents(
        executionId
    );

}



export function getExecutionIds(): string[] {

    return repository.getExecutionIds();

}
