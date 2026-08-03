export const ValidationRules = {


    DEFAULT_RESPONSE_RULES:{


        requiredFields:[

            "model",

            "content",

            "timestamp"

        ],


        blockedPatterns:[

            "ignore previous instructions",

            "drop database",

            "delete all",

            "system override"

        ]


    }


};
