const Abstract = require('./Abstract');

const ByteCollection = require('./../ByteCollection');
const PublicKey = require('./../Keys/PublicKey');
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
    let bc = this.bcFromInt(this[P_ACCOUNT_SIGNER].account, 4);
    if (!this[P_ACCOUNT_SIGNER].equals(this[P_ACCOUNT_TARGET])) {
      bc = bc.append(this.bcFromInt(this[P_ACCOUNT_TARGET].account, 4));
    }
    return ByteCollection.concat(
      this.bcFromInt(this.nOperation, 4),
      this.bcFromInt(this.fee.toMolina(), 8),
      this.payload,
      PublicKey.empty().encode(), // v2
      this[P_NEW_PUBLIC_KEY].encode(),
      this.bcFromInt(ChangeKey.OPTYPE),
    );
  }

  /**
     * Gets the raw implementation.
     *
     * @returns {ByteCollection}
     */
  toRaw() {
    throw 'todo';
  }
}

module.exports = Data;
