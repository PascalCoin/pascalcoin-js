/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const ByteCollection = require('./../ByteCollection');
const AccountNumber = require('./AccountNumber');

const P_BLOCK = Symbol('block');
const P_ACCOUNT = Symbol('account');
const P_N_OPERATION = Symbol('nOperation');
const P_MD160 = Symbol('md160');

/**
 * Holds information about an operation hash.
 */
class OperationHash {
  /**
     * Constructor
     *
     * @param {Number} block
     * @param {Number} account
     * @param {Number} nOperation
     * @param {ByteCollection} md160
     */
  constructor(block, account, nOperation, md160) {
    this[P_BLOCK] = block;
    this[P_ACCOUNT] = account;
    this[P_N_OPERATION] = nOperation;
    this[P_MD160] = md160;
  }

  /**
     * Decodes the given operation hash.
     *
     * @param {ByteCollection} opHash
     */
  static decode(opHash) {
    const block = opHash.slice(0, 4).switchEndian().toInt();
    const account = new AccountNumber(opHash.slice(4, 8).switchEndian().toInt());
    const nOperation = opHash.slice(8, 12).switchEndian().toInt();
    const md160 = opHash.slice(12);

    return new OperationHash(block, account, nOperation, md160);
  }

  /**
     * Creates the pascal encoding for an operation hash.
     *
     * @returns {ByteCollection}
     */
  encode() {
    return ByteCollection.concat(
      ByteCollection.fromInt(this[P_BLOCK], 4).switchEndian(),
      ByteCollection.fromInt(this[P_ACCOUNT].account, 4).switchEndian(),
      ByteCollection.fromInt(this[P_N_OPERATION], 4).switchEndian(),
      this[P_MD160],
    );
  }

  /**
     * Gets the operation hash as a pending operation.
     *
     * @returns {ByteCollection}
     */
  encodeAsPending() {
    return new OperationHash(0, this[P_ACCOUNT], this[P_N_OPERATION], this[P_MD160]).encode();
  }

  /**
     * Gets the account that executed the operation.
     *
     * @returns {AccountNumber}
     */
  get account() {
    return this[P_ACCOUNT];
  }

  /**
     * Gets the block number.
     *
     * @returns {Number}
     */
  get block() {
    return this[P_BLOCK];
  }

  /**
     * Gets the number of operations for the executing account.
     *
     * @returns {Number}
     */
  get nOperation() {
    return this[P_N_OPERATION];
  }

  /**
     * Gets the md160 of the op.
     *
     * @returns {ByteCollection}
     */
  get md160() {
    return this[P_MD160];
  }
}

module.exports = OperationHash;
