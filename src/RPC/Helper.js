const Client = require('./Client');

class Helper {
  /**
   *
   * @param rpc
   * @param reporter
   * @param name
   * @param type
   * @param start
   * @param max
   * @param onlyListed
   * @param exact
   * @param minBalance
   * @param maxBalance
   * @param publicKey
   * @returns {Promise<Array>}
   */
  static async findAllAccounts(rpc, reporter, name = null, type = null, start = 0, max = 100, onlyListed = false, exact = null,
    minBalance = null, maxBalance = null, publicKey = null) {
    const allAccounts = [];
    let resultAccounts = [];
    const numAccounts = (await rpc.getBlockCount().execute() - 1) * 5;
    do {
      const p = rpc.findAccounts(name, type, start, max, onlyListed, exact,
        minBalance, maxBalance, publicKey);
      resultAccounts = await p.execute();
      if (resultAccounts.length > 0) {
        // eslint-disable-next-line no-param-reassign
        start = resultAccounts[resultAccounts.length - 1].account + 1;
        resultAccounts.forEach(a => allAccounts.push(a));

        reporter(start, resultAccounts.length,
          resultAccounts[resultAccounts.length - 1].account / (numAccounts / 100));
      }
    } while (resultAccounts.length > 0 && resultAccounts.length === max);

    return allAccounts;
  }

  static async getAllAccountOperations(rpc, reporter, account, start = 0, max = 100) {
    const allAccounts = [];
    let resultAccounts = [];
    const numAccounts = await rpc.getAccount(account);
    do {
      const p = rpc.findAccounts(name, type, start, max, onlyListed, exact,
        minBalance, maxBalance, publicKey);
      resultAccounts = await p.execute();
      if (resultAccounts.length > 0) {
        // eslint-disable-next-line no-param-reassign
        start = resultAccounts[resultAccounts.length - 1].account + 1;
        resultAccounts.forEach(a => allAccounts.push(a));

        reporter(start, resultAccounts.length,
          resultAccounts[resultAccounts.length - 1].account / (numAccounts / 100));
      }
    } while (resultAccounts.length > 0 && resultAccounts.length === max);

    return allAccounts;


    const allOps = [];
    let resultOps = [];
    do {
      const p = rpc.getAccountOperations(account, 0, start, max);
      resultOps = await p.execute();
      if (resultOps.length > 0) {
        // eslint-disable-next-line no-param-reassign
        start = resultOps[resultOps.length - 1].account + 1;
        resultOps.forEach(a => allOps.push(a));

        reporter(start, resultOps.length);
      }
    } while (resultAccounts.length > 0 && resultAccounts.length === max);

    return allAccounts;
  }
}

module.exports = Helper;
