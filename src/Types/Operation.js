/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


const Abstract = require('./Abstract');
const AccountNumber = require('./AccountNumber');
const ByteCollection = require('./../ByteCollection');
const Currency = require('./Currency');
const OperationHash = require('./OperationHash');

const Sender = require('./Operation/Sender');
const Receiver = require('./Operation/Receiver');
const Changer = require('./Operation/Changer');

const P_VALID = Symbol('valid');
const P_ERRORS = Symbol('errors');
const P_BLOCK = Symbol('block');
const P_TIME = Symbol('time');
const P_OPBLOCK = Symbol('opblock');
const P_MATURATION = Symbol('maturation');
const P_OPTYPE = Symbol('optype');
const P_ACCOUNT = Symbol('account');
const P_OPTXT = Symbol('optxt');
const P_AMOUNT = Symbol('amount');
const P_FEE = Symbol('fee');
const P_BALANCE = Symbol('balance');
const P_OPHASH = Symbol('ophash');
const P_OLD_OPHASH = Symbol('old_ophash');
const P_SUBTYPE = Symbol('subtype');
const P_SIGNER_ACCOUNT = Symbol('signer_account');
const P_CHANGERS = Symbol('changers');
const P_SENDERS = Symbol('senders');
const P_RECEIVERS = Symbol('receivers');

/**
 * A class thats holds the information about an operation.
 */
class Operation extends Abstract {
  // The available optypes
  static get BLOCKCHAIN_REWARD() {
    return 0;
  }

  static get TRANSACTION() {
    return 1;
  }

  static get CHANGE_KEY() {
    return 2;
  }

  static get RECOVER_FUNDS() {
    return 3;
  }

  static get LIST_FOR_SALE() {
    return 4;
  }

  static get DELIST() {
    return 5;
  }

  static get BUY() {
    return 6;
  }

  static get CHANGE_KEY_ACCOUNT() {
    return 7;
  }

  static get CHANGE_ACCOUNT_INFO() {
    return 8;
  }

  static get MULTI_OPERATION() {
    return 9;
  }

  /**
     * Creates a new Operation instance from an rpc response.
     *
     * @param {Object} data
     */
  constructor(data) {
    super(data);

    this[P_VALID] = true;
    if (data.valid !== undefined) {
      this[P_VALID] = !!data.valid;
    }

    this[P_ERRORS] = null;
    if (data.errors !== undefined) {
      this[P_ERRORS] = data.errors;
    }

    this[P_BLOCK] = parseInt(data.block, 10);
    this[P_TIME] = parseInt(data.time, 10);
    this[P_OPBLOCK] = parseInt(data.opblock, 10);
    this[P_MATURATION] = 0;
    // pending
    if (data.maturation !== null) {
      this[P_MATURATION] = parseInt(data.maturation, 10);
    }

    this[P_OPTYPE] = parseInt(data.optype, 10);
    this[P_ACCOUNT] = new AccountNumber(data.account);
    this[P_OPTXT] = data.optxt;
    this[P_AMOUNT] = new Currency(data.amount);
    this[P_FEE] = new Currency(data.fee);
    this[P_BALANCE] = null;
    if (data.balance !== undefined) {
      this[P_BALANCE] = new Currency(data.balance);
    }

    this[P_OPHASH] = new OperationHash(data.ophash);

    this[P_OLD_OPHASH] = null;
    if (data.old_ophash !== undefined) {
      this[P_OLD_OPHASH] = ByteCollection.fromHex(data.old_ophash);
    }

    this[P_SUBTYPE] = data.subtype;
    this[P_SIGNER_ACCOUNT] = null;
    if (data.signer_account !== undefined) {
      this[P_SIGNER_ACCOUNT] = new AccountNumber(data.signer_account);
    }

    // eslint-disable-next-line no-multi-assign
    this[P_SENDERS] = this[P_RECEIVERS] = this[P_CHANGERS] = [];

    // loop given data and initialize objects
    data.senders.forEach(s => this[P_SENDERS].push(new Sender(s)));
    data.receivers.forEach(r => this[P_RECEIVERS].push(new Receiver(r)));
    data.changers.forEach(c => this[P_CHANGERS].push(new Changer(c)));
  }

  /**
     * Gets an indicator whether the operation was valid.
     *
     * @returns {Boolean}
     */
  get valid() {
    return this[P_VALID];
  }

  /**
     * If the operation is invalid you'll get the error message.
     *
     * @returns {String|null}
     */
  get errors() {
    return this[P_ERRORS];
  }

  /**
     * Gets the block that is associated with the operation.
     *
     * @returns {Number}
     */
  get block() {
    return this[P_BLOCK];
  }

  /**
     * Gets the time of the operation.
     *
     * @returns {Number}
     */
  get time() {
    return this[P_TIME];
  }

  /**
     * Gets the position inside a block.
     *
     * @returns {Number}
     */
  get opblock() {
    return this[P_OPBLOCK];
  }

  /**
     * Gets the age in blocks of the operation.
     *
     * @returns {Number}
     */
  get maturation() {
    return this[P_MATURATION];
  }

  /**
     * Gets the type of the operation.
     *
     * @returns {Number}
     */
  get optype() {
    return this[P_OPTYPE];
  }

  /**
     * Gets the account.
     *
     * @returns {AccountNumber}
     */
  get account() {
    return this[P_ACCOUNT];
  }

  /**
     * Gets a textual representation of the operation.
     *
     * @returns {String}
     */
  get optxt() {
    return this[P_OPTXT];
  }

  /**
     * Gets the amount.
     *
     * @returns {Currency}
     */
  get amount() {
    return this[P_AMOUNT];
  }

  /**
     * Gets the fee.
     *
     * @returns {Currency}
     */
  get fee() {
    return this[P_FEE];
  }

  /**
     * Gets the balance of the account.
     *
     * @returns {Number}
     */
  get balance() {
    return this[P_BALANCE];
  }

  /**
     * Gets the operation hash.
     *
     * @returns {OperationHash}
     */
  get opHash() {
    return this[P_OPHASH];
  }

  /**
     * Gets the <= V2 operation Hash.
     *
     * @returns {ByteCollection|null}
     */
  get oldOpHash() {
    return this[P_OLD_OPHASH];
  }

  /**
     * Gets the subtype.
     *
     * @returns {String}
     */
  get subtype() {
    return this[P_SUBTYPE];
  }

  /**
     * Gets the signer account number.
     *
     * @returns {AccountNumber|null}
     */
  get signerAccount() {
    return this[P_SIGNER_ACCOUNT];
  }

  /**
     * Gets the list of changers.
     *
     * @returns {Changer[]}
     */
  get changers() {
    return this[P_CHANGERS];
  }

  /**
     * Gets the list of senders.
     *
     * @returns {Sender[]}
     */
  get senders() {
    return this[P_SENDERS];
  }

  /**
     * Gets the list of receivers.
     *
     * @returns {Receiver[]}
     */
  get receivers() {
    return this[P_RECEIVERS];
  }
}

module.exports = Operation;
