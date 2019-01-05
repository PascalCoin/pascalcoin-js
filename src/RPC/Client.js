/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const Executor = require('./Executor');
const Caller = require('./Caller');

const BaseAction = require('./Actions/BaseAction');
const PagedAction = require('./Actions/PagedAction');
const OperationAction = require('./Actions/OperationAction');
const SignOperationAction = require('./Actions/SignOperationAction');

const P_EXECUTOR = Symbol('executor');

/**
 * A simple rpc client that will prepare an action that can be executed against
 * a node.
 */
class Client {
  /**
     * Returns a standard instance pointing to the given rpc host node.
     *
     * @param {String} rpcHostAddress
     * @returns {Client}
     */
  static factory(rpcHostAddress) {
    return new Client(
      new Executor(
        new Caller(rpcHostAddress),
      ),
    );
  }

  /**
     * Constructor
     *
     * @param {Executor} executor
     */
  constructor(executor) {
    this[P_EXECUTOR] = executor;
  }

  /**
     * Adds one or more nodes to connect to.
     *
     * @param {String[]} nodes
     * @returns {BaseAction}
     */
  addNode(...nodes) {
    return new BaseAction('addnode', { nodes: nodes.join(';') }, this[P_EXECUTOR]);
  }

  /**
     * Gets an account.
     *
     * @param {Account|AccountNumber|Number|String} account
     * @returns {BaseAction}
     */
  getAccount(account) {
    return new BaseAction('getaccount', { account }, this[P_EXECUTOR]);
  }

  /**
     * Gets a list of all accounts known by the remote node and
     * filtered by the given params.
     *
     * @param {String|ByteCollection|PublicKey|WalletPublicKey|PrivateKey|KeyPair} publicKey
     * @returns {BaseAction}
     */
  getWalletAccounts(publicKey = null) {
    return new PagedAction('getwalletaccounts', {
      pubkey: publicKey,
    }, this[P_EXECUTOR]);
  }

  /**
     * Gets the number of all accounts known by the remote node and
     * filtered by the given params.
     *
     * @param {String|ByteCollection|PublicKey|WalletPublicKey|PrivateKey|KeyPair} publicKey
     * @returns {BaseAction}
     */
  getWalletAccountsCount(publicKey = null) {
    return new BaseAction('getwalletaccountscount', {
      pubkey: publicKey,
    }, this[P_EXECUTOR]);
  }

  /**
     * Gets a list of all wallet public keys.
     *
     * @returns {BaseAction}
     */
  getWalletPublicKeys() {
    return new PagedAction('getwalletpubkeys', {
    }, this[P_EXECUTOR]);
  }

  /**
     *
     * @param {String|ByteCollection|PublicKey|WalletPublicKey|PrivateKey|KeyPair} pubkey
     * @returns {BaseAction}
     */
  getWalletPublicKey(publicKey) {
    return new BaseAction('getwalletpubkey', { pubkey: publicKey }, this[P_EXECUTOR]);
  }

  /**
     * Gets the balance of the wallet with the given keys or all keys.
     *
     * @param {String|ByteCollection|PublicKey|WalletPublicKey|PrivateKey|KeyPair} pubkey
     * @returns {BaseAction}
     */
  getWalletCoins(publicKey = null) {
    return new BaseAction('getwalletcoins', { pubkey: publicKey }, this[P_EXECUTOR]);
  }

  /**
     * Gets a block by the given block number.
     *
     * @param {Block|Number} block
     * @returns {BaseAction}
     */
  getBlock(block) {
    return new BaseAction('getblock', { block }, this[P_EXECUTOR]);
  }

  /**
     * Gets the list of blocks.
     *
     * @param {Number} last
     * @param {Number} start
     * @param {Number} end
     * @returns {BaseAction}
     */
  getBlocks(last = null, start = null, end = null) {
    return new BaseAction('getblocks', {
      last,
      start,
      end,
    }, this[P_EXECUTOR]);
  }

  /**
     * Gets the number of known blocks.
     *
     * @returns {BaseAction}
     */
  getBlockCount() {
    return new BaseAction('getblockcount', {}, this[P_EXECUTOR]);
  }

  /**
     * Gets the operation in the given block at the given position.
     *
     * @param {Block||Number} block
     * @param {Number} opblock
     * @returns {BaseAction}
     */
  getBlockOperation(block, opBlock) {
    return new BaseAction('getblockoperation', {
      block,
      opblock: opBlock,
    }, this[P_EXECUTOR]);
  }

  /**
     * Gets all operations of the given block.
     *
     * @param {Block|Number} block
     * @returns {BaseAction}
     */
  getBlockOperations(block) {
    return new PagedAction('getblockoperations', {
      block,
    }, this[P_EXECUTOR]);
  }

  /**
     * Gets the operations of an account.
     *
     * @param {Account|AccountNumber|Number|String} account
     * @param {Number} depth
     * @returns {BaseAction}
     */
  getAccountOperations(account, depth = 100) {
    return new PagedAction('getaccountoperations', {
      account,
      depth,
    }, this[P_EXECUTOR]);
  }

  /**
     * Gets the pending operations.
     *
     * @returns {BaseAction}
     */
  getPendings() {
    return new PagedAction('getpendings', { }, this[P_EXECUTOR]);
  }

  /**
     * Gets the number of pending operations.
     *
     * @returns {BaseAction}
     */
  getPendingsCount() {
    return new BaseAction('getpendingscount', {}, this[P_EXECUTOR]);
  }

  /**
     * Gets the operation identified by the given ophash.
     *
     * @param {String|ByteCollection|OperationHash} ophash
     * @returns {BaseAction}
     */
  findOperation(opHash) {
    return new BaseAction('findoperation', { ophash: opHash }, this[P_EXECUTOR]);
  }

  /**
     * Finds accounts with the given search criteria.
     *
     * @param {String} name
     * @param {Number} type
     * @param {Boolean} exact
     * @param {Currency} min_balance
     * @param {Currency} max_balance
     * @param {WalletPublicKey|PublicKey|ByteCollection|String} pubkey
     * @returns {PagedAction}
     */
  findAccounts(name = null, type = null, onlyListed = false, exact = null,
    minBalance = null, maxBalance = null, publicKey = null) {
    return new PagedAction('findaccounts', {
      name,
      type,
      listed: onlyListed,
      exact,
      min_balance: minBalance,
      max_balance: maxBalance,
      pubkey: publicKey,
    }, this[P_EXECUTOR]);
  }

  /**
     * Creates a new transaction.
     *
     * @param {Account|AccountNumber|Number|String} sender
     * @param {Account|AccountNumber|Number|String} target
     * @param {Currency} amount
     * @returns {OperationAction}
     */
  sendTo(sender, target, amount) {
    return new OperationAction('sendto', {
      sender,
      target,
      amount,
    }, this[P_EXECUTOR]);
  }

  /**
     * Changes the key of an account.
     *
     * @param {Account|AccountNumber|Number|String} account
     * @param {ByteCollection|PublicKey|WalletPublicKey|string} new_pubkey
     * @returns {OperationAction}
     */
  changeKey(account, newPublicKey) {
    return new OperationAction('changekey', {
      account,
      new_pubkey: newPublicKey,
    }, this[P_EXECUTOR]);
  }

  /**
     * Lists an account for sale.
     *
     * @param {Account|AccountNumber|Number|String} account_target
     * @param {Account|AccountNumber|Number|String} account_signer
     * @param {Currency} price
     * @param {Account|AccountNumber|Number|String} seller_account
     * @param {ByteCollection|String|PublicKey|WalletPublicKey} new_pubkey
     * @returns {OperationAction}
     */
  listAccountForSale(accountTarget, accountSigner, price, sellerAccount,
    newPublicKey = null) {
    return new OperationAction('listaccountforsale', {
      account_target: accountTarget,
      account_signer: accountSigner,
      price,
      seller_account: sellerAccount,
      new_pubkey: newPublicKey,
    }, this[P_EXECUTOR]);
  }

  /**
     * Lists an account for sale.
     *
     * @param {Account|AccountNumber|Number|String} account_target
     * @param {Account|AccountNumber|Number|String} account_signer
     * @returns {OperationAction}
     */
  delistAccountForSale(accountTarget, accountSigner) {
    return new OperationAction('delistaccountforsale', {
      account_target: accountTarget, account_signer: accountSigner,
    }, this[P_EXECUTOR]);
  }

  /**
     * Buys an account
     *
     * @param {Account|AccountNumber|Number|String} buyer_account
     * @param {Account|AccountNumber|Number|String} account_to_purchase
     * @param {Currency} price
     * @param {Account|AccountNumber|Number|String} seller_account
     * @param {ByteCollection|String|PublicKey|WalletPublicKey} new_enc_pubkey
     * @param {String} new_b58_pubkey
     * @param {Currency} amount
     * @param {Currency} fee
     * @param {ByteCollection|String} payload
     * @param {String} payload_method
     * @param {String} pwd
     * @returns {OperationAction}
     */
  buyAccount(buyerAccount, accountToPurchase, price = null, sellerAccount = null,
    newPublicKey = null, amount) {
    return new OperationAction('buyaccount', {
      buyer_account: buyerAccount,
      account_to_purchase: accountToPurchase,
      price,
      seller_account: sellerAccount,
      new_pubkey: newPublicKey,
      amount,
    }, this[P_EXECUTOR]);
  }

  /**
     *
     * @param accountTarget
     * @param accountSigner
     * @param newPublicKey
     * @param new_name
     * @param new_type
     * @returns {OperationAction}
     */
  changeAccountInfo(accountTarget, accountSigner, newPublicKey = null,
    new_name = null, new_type = null) {
    return new OperationAction('changeaccountinfo', {
      account_target: accountTarget,
      account_signer: accountSigner,
      new_pubkey: newPublicKey,
      new_name,
      new_type,
    }, this[P_EXECUTOR]);
  }

  /**
     *
     * @param rawOperations
     * @returns {BaseAction}
     */
  operationsInfo(rawOperations) {
    return new BaseAction('operationsinfo', { rawoperations: rawOperations }, this[P_EXECUTOR]);
  }

  /**
     *
     * @param rawOperations
     * @returns {BaseAction}
     */
  executeOperations(rawOperations) {
    return new BaseAction('executeoperations', { rawoperations: rawOperations }, this[P_EXECUTOR]);
  }

  /**
     * Signs a changeaccount info
     *
     * @param {Account|AccountNumber|Number|String} account_target
     * @param {Account|AccountNumber|Number|String} account_signer
     * @param {PublicKey|WalletPublicKey|ByteCollection|String} new_enc_pubkey
     * @param {String} new_b58_pubkey
     * @param {String} new_name
     * @param {Number} new_type
     * @param {Currency} fee
     * @param {ByteCollection|String} payload
     * @param {String} payload_method
     * @param {String} pwd
     * @returns {Promise<any>}
     */
  signChangeAccountInfo(accountTarget, accountSigner, signerPublicKey, newPublicKey,
    newName = null, newType = null) {
    return new SignOperationAction('signchangeaccountinfo', {
      account_target: accountTarget,
      account_signer: accountSigner,
      new_pubkey: newPublicKey,
      new_name: newName,
      new_type: newType,
      signer_pubkey: signerPublicKey,
    }, this[P_EXECUTOR]);
  }

  /**
     *
     * @param sender
     * @param target
     * @param senderPublicKey
     * @param targetPublicKey
     * @param amount
     * @returns {SignOperationAction}
     */
  signSendTo(sender, target, senderPublicKey, targetPublicKey, amount) {
    return new SignOperationAction('signsendto', {
      sender,
      target,
      sender_pubkey: senderPublicKey,
      target_pubkey: targetPublicKey,
      amount,
    }, this[P_EXECUTOR]);
  }

  /**
     *
     * @param account
     * @param oldPublicKey
     * @param newPublicKey
     * @returns {SignOperationAction}
     */
  signChangeKey(account, oldPublicKey, newPublicKey) {
    return new SignOperationAction('signchangekey', {
      account, old_pubkey: oldPublicKey, new_pubkey: newPublicKey,
    }, this[P_EXECUTOR]);
  }

  /**
     *
     * @param accountTarget
     * @param accountSigner
     * @param price
     * @param sellerAccount
     * @param newPublicKey
     * @param lockedUntilBlock
     * @param signerPublicKey
     * @returns {SignOperationAction}
     */
  signListAccountForSale(accountTarget, accountSigner, price, sellerAccount,
    newPublicKey, lockedUntilBlock, signerPublicKey) {
    return new SignOperationAction('signlistaccountforsale', {
      account_target: accountTarget,
      account_signer: accountSigner,
      price,
      seller_account: sellerAccount,
      new_pubkey: newPublicKey,
      locked_until_block: lockedUntilBlock,
      signer_pubkey: signerPublicKey,
    }, this[P_EXECUTOR]);
  }

  nodeStatus() {
    return new BaseAction('nodestatus', { }, this[P_EXECUTOR]);
  }
}

module.exports = Client;
