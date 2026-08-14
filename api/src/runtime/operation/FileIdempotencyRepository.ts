import {
    existsSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    unlinkSync,
    writeFileSync
} from "node:fs";

import {
    join
} from "node:path";

import {
    fileURLToPath
} from "node:url";

import {
    dirname
} from "node:path";

import type {
    IdempotencyRecord
} from "./IdempotencyRegistry.js";

import type {
    IdempotencyRepository
} from "./IdempotencyRepository.js";


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
        "../../storage/idempotency"
    );


export class FileIdempotencyRepository
implements IdempotencyRepository {

    private readonly directory:
        string;


    constructor(
        directory:
            string =
            defaultDirectory
    ) {

        this.directory =
            directory;


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


    private fileFor(
        key: string
    ): string {

        const encoded =
            Buffer
                .from(key)
                .toString("base64url");

        return join(
            this.directory,
            `${encoded}.json`
        );

    }


    get(
        key: string
    ): IdempotencyRecord | undefined {

        const file =
            this.fileFor(
                key
            );


        if (
            !existsSync(file)
        ) {

            return undefined;

        }


        return JSON.parse(
            readFileSync(
                file,
                "utf-8"
            )
        ) as IdempotencyRecord;

    }


    createIfAbsent(
        record: IdempotencyRecord
    ): boolean {

        const file =
            this.fileFor(
                record.key
            );


        if (
            existsSync(file)
        ) {
            return false;
        }


        writeFileSync(
            file,
            JSON.stringify(
                record,
                null,
                2
            ),
            {
                flag: "wx"
            }
        );


        return true;

    }


    save(
        record: IdempotencyRecord
    ): void {

        const file =
            this.fileFor(
                record.key
            );


        writeFileSync(
            file,
            JSON.stringify(
                record,
                null,
                2
            )
        );

    }


    clear(): void {

        const entries =
            readdirSync(
                this.directory,
                {
                    withFileTypes: true
                }
            );


        for (
            const entry
            of entries
        ) {

            if (
                entry.isFile() &&
                entry.name.endsWith(".json")
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
