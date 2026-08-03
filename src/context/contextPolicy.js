export const ContextPolicy = {

    DEFAULT_CONTEXT_POLICY: {

        name:
        "DEFAULT_CONTEXT_POLICY",


        blockedFields:[

            "password",

            "secret",

            "token",

            "private_key",

            "personal_data"

        ],


        allowedFields:[

            "id",

            "name",

            "role",

            "action",

            "metrics",

            "public_data"

        ]

    }

};
