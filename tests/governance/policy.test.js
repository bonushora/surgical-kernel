import { PolicyEngine }
from "../../src/policies/policyEngine.js";


const engine =
new PolicyEngine();



const allow =
engine.validate({

action:
"generate_report"

});


console.log(
"POLICY ALLOW:",
allow
);



const deny =
engine.validate({

action:
"drop_database"

});


console.log(
"POLICY DENY:",
deny
);

