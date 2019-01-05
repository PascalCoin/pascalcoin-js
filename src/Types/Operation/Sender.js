/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


const Abstract = require('./../Abstract');
const AccountNumber = require('../AccountNumber');
const Currency = require('../Currency');
const ByteCollection = require('../../ByteCollection');

const P_ACCOUNT = Symbol('account');
const P_AMOUNT = Symbol('amount');
const P_PAYLOAD = Symbol('payload');
const P_N_OPERATION = Symbol('nOperation');

/**
 * Represents a sender in an operation.
 */
class Sender extends Abstract {
  /**
     * Creates a new instance of the Sender class.
     *
     * @param {Object} data
     */
  constructor(data) {
    super(data);

    this[P_N_OPERATION] = parseInt(data.n_operation, 10);
    this[P_ACCOUNT] = new AccountNumber(data.account);
    this[P_AMOUNT] = new Currency(data.amount);
    this[P_PAYLOAD] = ByteCollection.fromHex(data.payload);
  }

  /**
     * Gets the n operation of thwe sender.
     *
     * @returns {Number}
     */
  get nOperation() {
    return this[P_N_OPERATION];
  }


  /**
     * Gets the account of the sender.
     *
     * @returns {AccountNumber}
     */
  get account() {
    return this[P_ACCOUNT];
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
     * Gets the payload.
     *
     * @returns {ByteCollection}
     */
  get payload() {
    return this[P_PAYLOAD];
  }
}

module.exports = Sender;
