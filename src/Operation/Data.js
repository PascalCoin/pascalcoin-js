const Abstract = require('./Abstract');
const AccountNumber = require('./../Types/AccountNumber');

const P_ACCOUNT_SIGNER = Symbol('account_signer');
const P_ACCOUNT_TARGET = Symbol('account_target');
const P_NEW_PUBLIC_KEY = Symbol('new_public_key');

/**
 * A transaction object that can be signed.
 */
class Data extends Abstract {
  /**
     * Gets the optype.
     *
     * @returns {number}
     */
  static get OPTYPE() {
    return 3;
  }

  /**
     *
     * @param account_signer
     * @param account_target
     * @param newPublicKey
     */
  constructor(account_signer, account_target, newPublicKey) {
    super();
    this[P_ACCOUNT_SIGNER] = new AccountNumber(account_signer);
    this[P_ACCOUNT_TARGET] = new AccountNumber(account_target);
    this[P_NEW_PUBLIC_KEY] = newPublicKey;
  }

  /**
     * Gets the digest of the operation.
     *
     * @returns {ByteCollection}
     */
  digest() {
    throw new Error('Not implemented');
  }

  /**
     * Gets the raw implementation.
     *
     * @returns {ByteCollection}
     */
  toRaw() {
    throw new Error('todo');
  }
}

module.exports = Data;
