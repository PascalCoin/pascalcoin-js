const Abstract = require('./Abstract');
const ByteCollection = require('./../ByteCollection');
const AccountNumber = require('./../Types/AccountNumber');
const Currency = require('./../Types/Currency');

const P_ACCOUNT_SIGNER = Symbol('account_signer');
const P_ACCOUNT_SENDER = Symbol('account_sender');
const P_ACCOUNT_TARGET = Symbol('account_target');
const P_DATA_TYPE = Symbol('data_type');
const P_DATA_SEQUENCE = Symbol('data_sequence');
const P_AMOUNT = Symbol('amount');

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
    return 10;
  }

  /**
   *
   * @param account_signer
   * @param account_sender
   * @param account_target
   */
  constructor(account_signer, account_sender, account_target) {
    super();
    this[P_ACCOUNT_SIGNER] = new AccountNumber(account_signer);
    this[P_ACCOUNT_SENDER] = new AccountNumber(account_sender);
    this[P_ACCOUNT_TARGET] = new AccountNumber(account_target);
    this[P_DATA_TYPE] = 0;
    this[P_DATA_SEQUENCE] = 0;
    this[P_AMOUNT] = new Currency(0);
  }

  withData(dataType, dataSequence, amount) {
    this[P_DATA_TYPE] = parseInt(dataType, 10);
    this[P_DATA_SEQUENCE] = parseInt(dataSequence, 10);
    this[P_AMOUNT] = new Currency(amount);
  }

  /**
   * Gets the digest of the operation.
   *
   * @returns {ByteCollection}
   */
  digest() {
    return ByteCollection.concat(
      this.bcFromInt(this[P_ACCOUNT_SIGNER].account, 4),
      this.bcFromInt(this[P_ACCOUNT_SENDER].account, 4),
      this.bcFromInt(this[P_ACCOUNT_TARGET].account, 4),
      this.bcFromInt(this.nOperation, 4),
      this.bcFromInt(this[P_DATA_TYPE], 2),
      this.bcFromInt(this[P_DATA_SEQUENCE], 2),
      this.bcFromInt(this[P_AMOUNT].toMolina(), 8),
      this.bcFromInt(this.fee.toMolina(), 8),
      this.bcFromBcWithSize(this.payload),
      this.bcFromInt(Data.OPTYPE, 1),
    );
  }

  /**
   * Gets the raw implementation.
   *
   * @returns {ByteCollection}
   */
  toRaw() {
    return ByteCollection.concat(
      this.bcFromInt(Data.OPTYPE, 4),
      this.bcFromInt(this[P_ACCOUNT_SIGNER].account, 4),
      this.bcFromInt(this[P_ACCOUNT_SENDER].account, 4),
      this.bcFromInt(this[P_ACCOUNT_TARGET].account, 4),
      this.bcFromInt(this.nOperation, 4),
      this.bcFromInt(this[P_DATA_TYPE], 2),
      this.bcFromInt(this[P_DATA_SEQUENCE], 2),
      this.bcFromInt(this[P_AMOUNT].toMolina(), 8),
      this.bcFromInt(this.fee.toMolina(), 8),
      this.bcFromBcWithSize(this.payload),
      this.bcFromSign(this.r, this.s),
    );
  }

  sign(keyPair, nOperation) {
    super.sign(keyPair, nOperation, true);
  }
}

module.exports = Data;
