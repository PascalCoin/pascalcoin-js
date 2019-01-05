const fs = require('fs');
const RPCClient = require('./../src/RPC/Client');
const rpc = RPCClient.factory('http://127.0.0.1:4103');

const destination = `${__dirname}/../test/fixtures/types`;

rpc.nodeStatus().execute().then((status) => {
  fs.writeFileSync(`${destination}/nodestatus.json`, JSON.stringify(status, null, 4));
});
