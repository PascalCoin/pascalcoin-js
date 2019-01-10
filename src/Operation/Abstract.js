/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const Payload = require('./../Crypto/Payload');
const Signing = require('./../Crypto/Signing');
const ByteCollection = require('./../ByteCollection');
const Currency = require('./../Types/Currency');

const P_PAYLOAD = Symbol('payload');
const P_S = Symbol('s');
const P_R = Symbol('r');
const P_FEE = Symbol('fee');
const P_N_OPERATION = Symbol('nOperation');

/**
 * Abstract class for RPC response objects.
 */
class Abstract {
  constructor() {
    this[P_PAYLOAD] = ByteCollection.fromString('');
    this[P_S] = null;
    this[P_R] = null;
    this[P_FEE] = new Currency(0);
  }

  /**
     * Sets the payload of the transaction instance.
     *
     * @param {String} payload
     * @param {String} method
     * @param {String} key
     *
     * @returns {Abstract}
     */
  withPayload(payload, method = 'none', key = null) {
    this.throwIfSigned();

    this[P_PAYLOAD] = Payload.encrypt(payload, method, key);
    return this;
  }

  /**
     * Sets the fee.
     *
     * @param {Currency} fee
     * @returns {Abstract}
     */
  withFee(fee) {
    this.throwIfSigned();
    this[P_FEE] = fee;
    return this;
  }

  /**
     * Returns a ByteCollection with the digest that needs to be hashed.
     *
     * @return {ByteCollection}
     */
  // eslint-disable-next-line class-methods-use-this
  digest() {
    throw new Error('Not implemented');
  }

  /**
   * Signs the given operation and returns a new rawoperations string.
   *
   * @param {KeyPair} keyPair
   * @param {Number} nOperation
   * @param {Boolean} useDigest
   * @returns {Abstract}
   */
  sign(keyPair, nOperation, useDigest = false) {
    this[P_N_OPERATION] = nOperation;
    this.throwIfSigned();
    const digest = this.digest();

    let signResult;

    if (useDigest === true) {
      signResult = Signing.signWithDigest(keyPair, digest);
    } else {
      signResult = Signing.signWithHash(keyPair, digest);
    }

    // save results
    this[P_R] = signResult.r;
    this[P_S] = signResult.s;

    return this;
  }

  /**
     * Returns the ByteCollection for a rawoperations info.
     *
     * @return {ByteCollection}
     */
  toRaw() { // eslint-disable-line class-methods-use-this
    throw new Error('Not implemented');
  }

  /**
     * Returns a new instance of the derived class based on the given raw
     * string.
     *
     * @return {Abstract}
     */
  // eslint-disable-next-line class-methods-use-this
  static fromRaw() {
    throw new Error('Not implemented');
  }

  /**
     * Gets a bytecollection from the given int value.
     *
     * @param {Number} value
     * @param {Number|undefined} size
     * @returns {ByteCollection}
     */
  // eslint-disable-next-line class-methods-use-this
  bcFromInt(value, size = null) {
    return (size === null ?
      ByteCollection.fromInt(value) :
      ByteCollection.fromInt(value, size)).switchEndian();
  }

  /**
     * Gets the given string as a byte collection with the size of the string
     * prepended.
     *
     * @param {String} value
     * @returns {ByteCollection}
     */
  bcFromStringWithSize(value) {
    return ByteCollection.concat(
      this.bcFromInt(value.length, 2),
      this.bcFromString(value),
    );
  }

  /**
     * Gets the given bytecollection as a byte collection with the size of
     * the bytecollection prepended.
     *
     * @param {ByteCollection} value
     * @returns {ByteCollection}
     */
  bcFromBcWithSize(value) {
    return ByteCollection.concat(
      this.bcFromInt(value.toHex().length / 2, 2),
      value,
    );
  }

  /**
     * Gets the bytecollection from the given string.
     *
     * @param {String} value
     * @returns {ByteCollection}
     */
  bcFromString(value) { // eslint-disable-line class-methods-use-this
    return ByteCollection.fromString(value);
  }

  /**
     * Returns the bytecollection for an r and s signing result.
     *
     * @param {ByteCollection} r
     * @param {ByteCollection} s
     * @returns {ByteCollection}
     */
  bcFromSign(r, s) {
    return ByteCollection.concat(
      this.bcFromBcWithSize(r),
      this.bcFromBcWithSize(s),
    );
  }

  /**
     * Gets the prepared payload.
     *
     * @returns {ByteCollection}
     */
  get payload() {
    return this[P_PAYLOAD];
  }

  /**
     * Gets the r value of the sign result.
     *
     * @returns {ByteCollection|null}
     */
  get r() {
    return this[P_R];
  }

  /**
     * Gets the s value of the sign result.
     *
     * @returns {ByteCollection|null}
     */
  get s() {
    return this[P_S];
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
     * Gets the n operation.
     *
     * @returns {Number}
     */
  get nOperation() {
    return this[P_N_OPERATION];
  }

  /**
     * Gets a value indicating whether the current operation is already signed.
     *
     * @returns {boolean}
     */
  get isSigned() {
    return this[P_S] !== null && this[P_R] !== null;
  }

  /**
     * Throws an error if the op is already signed.
     */
  throwIfSigned() {
    if (this.isSigned) {
      throw new Error("An already signed operation can't be altered.");
    }
  }
}

module.exports = Abstract;
