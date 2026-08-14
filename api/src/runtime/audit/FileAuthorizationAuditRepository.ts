import {
    AuthorizationAuditEvent
} from "./AuthorizationAuditEvent.js";

import {
    AuthorizationAuditRepository
} from "./AuthorizationAuditRepository.js";

import {
    AuthorizationAuditQuery,
    matchesAuthorizationAuditQuery
} from "./AuthorizationAuditQuery.js";

import {
    existsSync,
    mkdirSync,
    readFileSync,
    writeFileSync,
    renameSync,
    openSync,
    fsyncSync,
    closeSync,
    readdirSync,
    unlinkSync
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
        "../storage/authorization-audit"
    );


export class FileAuthorizationAuditRepository
implements AuthorizationAuditRepository {

    private directory =
        defaultDirectory;

    private crashHook:
        () => void;


    constructor(
        crashHook: () => void = () => {}
    ) {

        this.crashHook =
            crashHook;

        if (
            !existsSync(
                this.directory
            )
        ) {

            mkdirSync(
                this.directory,
                {
                    recursive: true
                }
            );

        }

    }


    append(
        event: AuthorizationAuditEvent
    ): AuthorizationAuditEvent {

        const file =
            join(
                this.directory,
                `${event.auditId}.json`
            );


        const temporaryFile =
            `${file}.tmp`;


        const serialized =
            JSON.stringify(
                event,
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


    getByOperationId(
        operationId: string
    ): AuthorizationAuditEvent[] {

        return this.query({
            operationId
        });

    }


    query(
        query: AuthorizationAuditQuery
    ): AuthorizationAuditEvent[] {

        return this.getAll()
            .filter(
                event =>
                    matchesAuthorizationAuditQuery(
                        event,
                        query
                    )
            );

    }


    getAll(): AuthorizationAuditEvent[] {

        if (
            !existsSync(
                this.directory
            )
        ) {

            return [];

        }


        return readdirSync(
            this.directory,
            {
                withFileTypes: true
            }
        )
            .filter(
                entry =>
                    entry.isFile() &&
                    entry.name.endsWith(
                        ".json"
                    )
            )
            .map(
                entry =>
                    join(
                        this.directory,
                        entry.name
                    )
            )
            .map(
                file =>
                    JSON.parse(
                        readFileSync(
                            file,
                            "utf-8"
                        )
                    ) as AuthorizationAuditEvent
            )
            .sort(
                (a, b) =>
                    a.timestamp.localeCompare(
                        b.timestamp
                    )
            );

    }


    clear(): void {

        if (
            !existsSync(
                this.directory
            )
        ) {

            return;

        }


        for (
            const entry of readdirSync(
                this.directory,
                {
                    withFileTypes: true
                }
            )
        ) {

            if (
                entry.isFile() &&
                (
                    entry.name.endsWith(
                        ".json"
                    ) ||
                    entry.name.endsWith(
                        ".json.tmp"
                    )
                )
            ) {

                unlinkSync(
                    join(
                        this.directory,
                        entry.name
                    )
                );

            }

        }

    }

}
