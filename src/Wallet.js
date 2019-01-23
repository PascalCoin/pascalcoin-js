/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const KeyPair = require('./Keys/KeyPair');
const Account = require('./Types/Account');
const Operation = require('./Types/Operation');
const Transaction = require('./Operation/Transaction');
const OperationsBuilder = require('./Operation/OperationsBuilder');
const RPCClient = require('./RPC/Client');
const RPCExecutor = require('./RPC/Executor');
const RPCCaller = require('./RPC/Caller');

const P_KEYPAIR = Symbol('keypair');
const P_RPC = Symbol('rpc');
const P_ACCOUNTS = Symbol('accounts');

class Wallet {
  constructor(rpcHostAddress, concurrency = 10) {
    this[P_KEYPAIR] = null;
    this[P_RPC] = new RPCClient(
      new RPCExecutor(
        new RPCCaller(rpcHostAddress), concurrency
      ),
    );

  }

  /**
     *
     * @param privateKeyEncoded
     * @param password
     */
  authenticate(privateKeyEncoded, password) {
    this[P_KEYPAIR] = KeyPair.fromEncryptedPrivateKey(privateKeyEncoded, password);
  }

  /**
     * Gets a value indicating whether there is a valid key pair to work with.
     *
     * @returns {boolean}
     */
  isAuthenticated() {
    return this[P_KEYPAIR] !== null;
  }

  /**
   * Gets all accounts associated with the key.
   *
   * @returns {Promise<*>}
   */
  async getAccountsOfKey() {

    if (!this.isAuthenticated()) {
      return Promise.resolve([]);
    }

    const action = this[P_RPC].findAccounts('', -1, false, true, -1, -1,
      this[P_KEYPAIR].publicKey.toBase58());

    this[P_ACCOUNTS] = await action.executeAllTransformArray(Account);
    return this[P_ACCOUNTS];
  }

  /**
   * Initiates a new transaction.
   *
   * @param {AccountNumber|Account|String|Number} from
   * @param {AccountNumber|Account|String|Number} to
   * @param {Currency|Number} amount
   *
   * @returns {Transaction}
   */
  initiateSendTo(from, to, amount) {
    return new Transaction(from, to, amount);
  }

  /**
   * Executes the given operation. If tryFeeLess flag is set, we will try to
   * send without a fee first.
   *
   * @param {Transaction} operation
   * @returns {Promise}
   */
  async sendTo(operation) {
    const sender = await this[P_RPC].getAccount(operation.sender).executeTransformItem(Account);

    operation.sign(this[P_KEYPAIR], sender.nOperation + 1);
    let builder = new OperationsBuilder();

    builder.addOperation(operation);
    let remoteOp = await this[P_RPC].executeOperations(builder.build()).executeTransformArray(Operation);

    if (remoteOp[0].valid) {
      return remoteOp[0];
    }

    operation.withFee(0.0001);
    operation.sign(this[P_KEYPAIR], sender.nOperation + 1);
    builder = new OperationsBuilder();
    builder.addOperation(operation);
    remoteOp = await this[P_RPC].executeOperations(builder.build()).executeTransformArray(Operation);
    return remoteOp[0];
  }
}

module.exports = Wallet;
