import {
    describe,
    expect,
    it,
    vi
} from "vitest";

import {
    AuthProvider,
    HttpTransport,
    KernelRuntime,
    MiddlewarePipeline,
    PluginManager,
    RetryPolicy,
    SurgicalKernelClient,
    Telemetry
} from "../../src/index";

import type {
    ExecutionContext,
    ExecutionMode,
    ExecutionRequest,
    ExecutionResponse,
    ExecutionRole,
    ExecutionStatus
} from "../../src/index";


describe(
    "Surgical SDK v0.7.0 — Public Runtime Contract",
    () => {

        it(
            "should expose the public execution context contract",
            () => {

                const role: ExecutionRole =
                    "consumer";

                const context: ExecutionContext = {

                    organizationId:
                        "org-001",

                    projectId:
                        "project-001",

                    actorId:
                        "actor-001",

                    role

                };

                expect(context).toEqual({

                    organizationId:
                        "org-001",

                    projectId:
                        "project-001",

                    actorId:
                        "actor-001",

                    role:
                        "consumer"

                });

            }
        );


        it(
            "should expose the public execution request contract",
            () => {

                const mode: ExecutionMode =
                    "deterministic";

                const request: ExecutionRequest = {

                    context: {

                        organizationId:
                            "org-001",

                        projectId:
                            "project-001",

                        actorId:
                            "actor-001",

                        role:
                            "consumer"

                    },

                    projectId:
                        "project-001",

                    mode,

                    request:
                        "Gerar relatório"

                };

                expect(request.projectId)
                    .toBe("project-001");

                expect(request.mode)
                    .toBe("deterministic");

                expect(request.request)
                    .toBe("Gerar relatório");

            }
        );


        it(
            "should expose the public execution response contract",
            () => {

                const state: ExecutionStatus =
                    "initialized";

                const response: ExecutionResponse = {

                    executionId:
                        "exec-001",

                    status:
                        "accepted",

                    mode:
                        "deterministic",

                    state

                };

                expect(response).toEqual({

                    executionId:
                        "exec-001",

                    status:
                        "accepted",

                    mode:
                        "deterministic",

                    state:
                        "initialized"

                });

            }
        );


        it(
            "should export the public runtime classes",
            () => {

                expect(SurgicalKernelClient)
                    .toBeDefined();

                expect(KernelRuntime)
                    .toBeDefined();

                expect(HttpTransport)
                    .toBeDefined();

                expect(MiddlewarePipeline)
                    .toBeDefined();

                expect(AuthProvider)
                    .toBeDefined();

                expect(RetryPolicy)
                    .toBeDefined();

                expect(Telemetry)
                    .toBeDefined();

                expect(PluginManager)
                    .toBeDefined();

            }
        );


        it(
            "should execute SurgicalKernelClient against the public /execute contract",
            async () => {

                const responsePayload: ExecutionResponse = {

                    executionId:
                        "exec-sdk-001",

                    status:
                        "accepted",

                    mode:
                        "deterministic",

                    state:
                        "initialized"

                };


                const fetchMock =
                    vi.fn()
                        .mockResolvedValue({

                            ok:
                                true,

                            status:
                                200,

                            json:
                                async () =>
                                    responsePayload

                        });


                vi.stubGlobal(
                    "fetch",
                    fetchMock
                );


                const client =
                    new SurgicalKernelClient(
                        "http://localhost:3000/api"
                    );


                const request: ExecutionRequest = {

                    context: {

                        organizationId:
                            "org-001",

                        projectId:
                            "project-001",

                        actorId:
                            "actor-001",

                        role:
                            "consumer"

                    },

                    projectId:
                        "project-001",

                    mode:
                        "deterministic",

                    request:
                        "Gerar relatório"

                };


                const response =
                    await client.execute(
                        request
                    );


                expect(
                    fetchMock
                ).toHaveBeenCalledTimes(1);


                expect(
                    fetchMock
                ).toHaveBeenCalledWith(

                    "http://localhost:3000/api/execute",

                    expect.objectContaining({

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        }

                    })

                );


                expect(
                    response
                ).toEqual(
                    responsePayload
                );


                vi.unstubAllGlobals();

            }
        );

    }
);
