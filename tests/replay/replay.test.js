import { DeterministicReplay }
from "../../src/replay/deterministicReplay.js";


const engine =
new DeterministicReplay();



const snapshot = {


snapshotVersion:
"BH-SDP-v1",


data:{


request:{
action:"generate_report"
},


policy:{
decision:"ALLOW"
},


context:{
user:"teste"
},


response:{
content:"resultado"
}


}


};



const result =
engine.replay(snapshot);



console.log(
"DETERMINISTIC REPLAY:",
result
);
