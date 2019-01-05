const fs = require('fs');
const path = require('path');
const NetProtocol = require('../../../src/Types/Node/NetProtocol');

describe('NodeStatus.NetProtocol', () => {
  it('can be created from a RPC response', () => {
    const raw = JSON.parse(fs.readFileSync(path.join(__dirname, '/../../fixtures/types/nodestatus.json')));
    new NetProtocol(raw.netprotocol);
  });
});
