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



export async function appendEvent(
    event: ExecutionEvent
): Promise<ExecutionEvent> {

    return await repository.append(
        event
    );

}



export async function getEvents(
    executionId: string
): Promise<ExecutionEvent[]> {

    return await repository.getEvents(
        executionId
    );

}



export async function getExecutionIds(): Promise<string[]> {

    return await repository.getExecutionIds();

}
