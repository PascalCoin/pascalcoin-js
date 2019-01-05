const fs = require('fs');
const path = require('path');
const NetStats = require('../../../src/Types/Node/NetStats');

describe('NodeStatus.NetStats', () => {
  it('can be created from a RPC response', () => {
    const raw = JSON.parse(fs.readFileSync(path.join(__dirname, '/../../fixtures/types/nodestatus.json')));
    new NetStats(raw.netstats);
  });
});
