/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


const BigNumber = require('bignumber.js');

const P_VALUE = Symbol('value');

/**
 * A simple wrapper around bignumber for the pascal currency and
 * basic math functions.
 */
class Currency {
  /**
     * Creates a new Currency instance.
     *
     * @param {Number|String|BigNumber} value
     */
  constructor(value) {
    let pasc = value;
    if (pasc instanceof Currency) {
      this[P_VALUE] = pasc.value;
      return;
    }

    if (typeof pasc === 'string') {
      pasc = pasc.split(',').join('');
    }

    this[P_VALUE] = new BigNumber(pasc.toString());
  }

  /**
     * Gets the BigNumber instance.
     *
     * @returns {BigNumber}
     */
  get value() {
    return this[P_VALUE];
  }

  /**
     * Gets the pascal value as a string.
     *
     * @returns {string}
     */
  toString() {
    return this[P_VALUE].toFixed(4);
  }

  /**
     * Gets the pascal value as a string.
     *
     * @returns {Number}
     */
  toMolina() {
    return parseFloat(this[P_VALUE].toString()) * 10000;
  }

  /**
     * Adds the given value to the current value and returns a **new**
     * value.
     *
     * @param {Currency} addValue
     * @returns {Currency}
     */
  add(addValue) {
    return new Currency(
      this.value.plus(addValue.value).toFixed(4),
    );
  }

  /**
     * Subtracts the given value from the current value and returns a
     * **new** value.
     *
     * @param {Currency} subValue
     * @returns {Currency}
     */
  sub(subValue) {
    return new Currency(
      this.value.minus(subValue.value).toFixed(4),
    );
  }

  /**
     * Gets a positive variant of the value. If the value is already
     * positive, the current instance will be returned, else a new
     * instance.
     *
     * @returns {Currency}
     */
  toPositive() {
    if (!this[P_VALUE].isPositive()) {
      return new Currency(
        this[P_VALUE].multipliedBy(-1).toFixed(4),
      );
    }

    return this;
  }

  /**
     * Gets the serialized version of this instance.
     *
     * @returns {Object}
     */
  serialize() {
    return {
      pascal: this.toString(),
      molina: this[P_VALUE].toString(),
    };
  }
}

module.exports = Currency;
