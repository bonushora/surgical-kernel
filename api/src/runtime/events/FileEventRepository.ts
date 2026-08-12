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
    writeFileSync,
    readdirSync
} from "node:fs";

import {
    dirname,
    join
} from "node:path";

import {
    fileURLToPath
} from "node:url";



const currentFile =
    fileURLToPath(
        import.meta.url
    );



const currentDirectory =
    dirname(
        currentFile
    );



const defaultDirectory =
    join(
        currentDirectory,
        "../storage/events"
    );



export class FileEventRepository
implements EventRepository {

    private directory =
        defaultDirectory;



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



    getExecutionIds():string[] {

        const entries =
            readdirSync(
                this.directory,
                {
                    withFileTypes:true
                }
            );


        return entries
            .filter(
                entry =>
                    entry.isFile() &&
                    entry.name.endsWith(".json")
            )
            .map(
                entry =>
                    entry.name.slice(
                        0,
                        -5
                    )
            );

    }



    clear():void {}

}
