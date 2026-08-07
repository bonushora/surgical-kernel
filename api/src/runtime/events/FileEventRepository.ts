import {
    ExecutionEvent
} from "./ExecutionEvent.js";


import {
    EventRepository
} from "./EventRepository.js";


import {
    existsSync,
    mkdirSync,
    readFileSync,
    writeFileSync
} from "node:fs";


import {
    join
} from "node:path";



export class FileEventRepository
implements EventRepository {


    private directory =
        "src/runtime/storage/events";



    constructor(){

        if(!existsSync(this.directory)){

            mkdirSync(
                this.directory,
                {
                    recursive:true
                }
            );

        }

    }



    append(
        event:ExecutionEvent
    ):ExecutionEvent {


        const file =
            join(
                this.directory,
                `${event.executionId}.json`
            );


        const events =
            existsSync(file)
            ?
            JSON.parse(
                readFileSync(
                    file,
                    "utf-8"
                )
            )
            :
            [];


        events.push(
            event
        );


        writeFileSync(
            file,
            JSON.stringify(
                events,
                null,
                2
            )
        );


        return event;

    }



    getEvents(
        executionId:string
    ):ExecutionEvent[] {


        const file =
            join(
                this.directory,
                `${executionId}.json`
            );


        if(!existsSync(file)){

            return [];

        }


        return JSON.parse(
            readFileSync(
                file,
                "utf-8"
            )
        );

    }



    clear():void {}

}
