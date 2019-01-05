const Abstract = require('./Abstract');

const ByteCollection = require('./../ByteCollection');
const PublicKey = require('./../Keys/PublicKey');
const Currency = require('./../Types/Currency');
const AccountNumber = require('./../Types/AccountNumber');

const P_SENDER = Symbol('sender');
const P_TARGET = Symbol('target');
const P_AMOUNT = Symbol('amount');

/**
 * A transaction object that can be signed.
 */
class Transaction extends Abstract {
  /**
     * Gets the optype.
     *
     * @returns {number}
     */
  static get OPTYPE() {
    return 1;
  }

  /**
     * Creates a new Transaction instance with the given data. The payload is
     * empty by default and not encoded.
     *
     * @param {AccountNumber|Account|String|Number} sender
     * @param {AccountNumber|Account|String|Number} target
     * @param {Currency} amount
     */
  constructor(sender, target, amount) {
    super();
    this[P_SENDER] = new AccountNumber(sender);
    this[P_TARGET] = new AccountNumber(target);
    this[P_AMOUNT] = new Currency(amount);
  }

  /**
     * Gets the digest of the operation.
     *
     * @returns {ByteCollection}
     */
  digest() {
    return ByteCollection.concat(
      this.bcFromInt(this[P_SENDER].account, 4),
      this.bcFromInt(this.nOperation, 4),
      this.bcFromInt(this[P_TARGET].account, 4),
      this.bcFromInt(this[P_AMOUNT].toMolina(), 8),
      this.bcFromInt(this.fee.toMolina(), 8),
      this.payload,
      ByteCollection.fromInt(0, 2),
      ByteCollection.fromInt(Transaction.OPTYPE),
    );
  }

  /**
     * Gets the signed raw operations.
     *
     * @returns {ByteCollection}
     */
  toRaw() {
    return ByteCollection.concat(
      this.bcFromInt(Transaction.OPTYPE, 4),
      this.bcFromInt(this[P_SENDER].account, 4),
      this.bcFromInt(this.nOperation, 4),
      this.bcFromInt(this[P_TARGET].account, 4),
      this.bcFromInt(this[P_AMOUNT].toMolina(), 8),
      this.bcFromInt(this.fee.toMolina(), 8),
      this.bcFromBcWithSize(this.payload),
      PublicKey.empty().encode(), // v2
      this.bcFromSign(this.r, this.s),
    );
  }
}

module.exports = Transaction;
