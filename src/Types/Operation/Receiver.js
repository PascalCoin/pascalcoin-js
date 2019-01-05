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

/**
 * Represents a receiver in an operation.
 */
class Receiver extends Abstract {
  /**
     * Creates a new instance of the Receiver class.
     *
     * @param {Object} data
     */
  constructor(data) {
    super(data);

    this[P_ACCOUNT] = new AccountNumber(data.account);
    this[P_AMOUNT] = new Currency(data.amount);
    this[P_PAYLOAD] = ByteCollection.fromHex(data.payload);
  }

  /**
     * Gets the account of the receiver.
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

module.exports = Receiver;
