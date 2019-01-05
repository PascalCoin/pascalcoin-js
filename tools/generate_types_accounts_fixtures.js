const fs = require('fs');
const RPCClient = require('./../src/RPC/Client');
const rpc = RPCClient.factory('http://127.0.0.1:4003');

const destination = `${__dirname}/../test/fixtures/types/account/`;

const accounts = {
  accountNotForSale: 6937,
  accountForPublicSale: 1924,
  accountForPrivateSale: 123,
  accountLocked: 334344,
  accountWithName: 1000,
  accountWithoutName: 992,
};


Object.keys(accounts).forEach((accountType) => {
  rpc.getAccount(accounts[accountType]).execute().then((account) => {
    fs.writeFileSync(`${destination}/${accountType}.json`, JSON.stringify(account));
  });
});
