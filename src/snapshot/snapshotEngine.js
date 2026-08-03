
export class SnapshotEngine {


create(data){


return {

snapshotVersion:"BH-SDP-v1",

data,

created:
new Date().toISOString()

};


}


}

