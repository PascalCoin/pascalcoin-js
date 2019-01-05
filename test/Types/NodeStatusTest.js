const fs = require('fs');
const path = require('path');
const NodeStatus = require('../../src/Types/NodeStatus');

describe('NodeStatus', () => {
  it('can be created from a RPC response', () => {
    const raw = JSON.parse(fs.readFileSync(path.join(__dirname, '/../fixtures/types/nodestatus.json')));
    new NodeStatus(raw);
  });
});
