export interface KernelEvent {

    type: string;

    executionId: string;

    timestamp: string;

    payload?: Record<string, unknown>;

}


type EventListener =
    (event: KernelEvent) => void;


export class EventBus {


    private listeners:
        EventListener[] = [];


    subscribe(
        listener: EventListener
    ): void {

        this.listeners.push(
            listener
        );

    }


    publish(
        event: KernelEvent
    ): void {


        for (
            const listener
            of this.listeners
        ) {

            listener(event);

        }

    }

}
