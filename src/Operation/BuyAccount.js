const Abstract = require('./Abstract');

const ByteCollection = require('./../ByteCollection');
const PublicKey = require('./../Keys/PublicKey');
const Currency = require('./../Types/Currency');
const AccountNumber = require('./../Types/AccountNumber');

const P_SENDER = Symbol('sender');
const P_TARGET = Symbol('target');
const P_AMOUNT = Symbol('amount');
const P_ACCOUNT_PRICE = Symbol('account_price');
const P_SELLER_ACCOUNT = Symbol('seller_account');
const P_NEW_PUBLIC_KEY = Symbol('new_public_key');

/**
 * A transaction object that can be signed.
 */
class BuyAccount extends Abstract {
  /**
     * Gets the optype.
     *
     * @returns {number}
     */
  static get OPTYPE() {
    return 6;
  }

  /**
   * Creates a new Transaction instance with the given data. The payload is
   * empty by default and not encoded.
   *
   * @param {AccountNumber|Account|String|Number} sender
   * @param {AccountNumber|Account|String|Number} target
   * @param {Currency} amount
   * @param {Currency} accountPrice
   * @param {AccountNumber|Account|String|Number} sellerAccount
   * @param {AccountNumber|Account|String|Number} newPublicKey
   */
  constructor(sender, target, amount, accountPrice, sellerAccount, newPublicKey) {
    super();
    this[P_SENDER] = new AccountNumber(sender);
    this[P_TARGET] = new AccountNumber(target);
    this[P_AMOUNT] = new Currency(amount);
    this[P_ACCOUNT_PRICE] = new Currency(accountPrice);
    this[P_SELLER_ACCOUNT] = new Currency(sellerAccount);
    this[P_NEW_PUBLIC_KEY] = new Currency(newPublicKey);
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
      ByteCollection.fromInt(BuyAccount.OPTYPE),
    );
  }

  /**
     * Gets the signed raw operations.
     *
     * @returns {ByteCollection}
     */
  toRaw() {
    return ByteCollection.concat(
      this.bcFromInt(BuyAccount.OPTYPE, 4),
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

module.exports = BuyAccount;
