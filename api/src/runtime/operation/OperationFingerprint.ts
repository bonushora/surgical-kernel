import {
    createHash
} from "node:crypto";

import type {
    OperationRequest
} from "./OperationContract.js";


export function createOperationFingerprint(
    input: OperationRequest
): string {

    const canonical =
        JSON.stringify({

            context:
                input.context,

            mode:
                input.mode,

            request:
                input.request

        });


    return createHash(
        "sha256"
    )
        .update(
            canonical,
            "utf8"
        )
        .digest(
            "hex"
        );

}
