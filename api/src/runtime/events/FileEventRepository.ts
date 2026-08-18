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
    renameSync,
    openSync,
    fsyncSync,
    closeSync,
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

    private crashHook:
        () => void;



    constructor(
        crashHook: () => void = () => {}
    ){

        this.crashHook =
            crashHook;

        if(!existsSync(this.directory)){

            mkdirSync(
                this.directory,
                {
                    recursive:true
                }
            );

        }

    }



    async append(
        event:ExecutionEvent
    ):Promise<ExecutionEvent> {

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


        const temporaryFile =
            `${file}.tmp`;


        const serialized =
            JSON.stringify(
                events,
                null,
                2
            );


        writeFileSync(
            temporaryFile,
            serialized,
            "utf-8"
        );


        const descriptor =
            openSync(
                temporaryFile,
                "r"
            );

        try {

            fsyncSync(
                descriptor
            );

        } finally {

            closeSync(
                descriptor
            );

        }


        this.crashHook();


        renameSync(
            temporaryFile,
            file
        );


        return event;

    }



    async getEvents(
        executionId:string
    ):Promise<ExecutionEvent[]> {

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



    async getExecutionIds():Promise<string[]> {

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



    async clear():Promise<void> {}

}
