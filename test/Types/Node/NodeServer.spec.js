const fs = require('fs');
const path = require('path');
const NodeServer = require('../../../src/Types/Node/NodeServer');

describe('NodeStatus.NodeServer', () => {
  it('can be created from a RPC response', () => {
    const raw = JSON.parse(fs.readFileSync(path.join(__dirname, '/../../fixtures/types/nodestatus.json')));
    raw.nodeservers.forEach(s => new NodeServer(s));
  });
});
