/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const ByteCollection = require('./../ByteCollection');
const Curve = require('./Curve');
const AES = require('./../Crypto/AES');

const P_KEY = Symbol('key');
const P_CURVE = Symbol('curve');
const P_LENGTH = Symbol('length');

/**
 * Represents a public key in pascalcoin.
 */
class PrivateKey {
  /**
     * Constructor
     *
     * @param {ByteCollection} key
     * @param {Curve} curve
     */
  constructor(key, curve) {
    this[P_KEY] = key;
    this[P_CURVE] = curve;
    this[P_LENGTH] = key.length;
  }

  /**
     * Gets the key value.
     *
     * @returns {ByteCollection}
     */
  get key() {
    return this[P_KEY];
  }

  /**
     * Gets the ec key.
     *
     * @returns {ByteCollection}
     */
  get ec() {
    return this.key;
  }

  /**
     * Gets the y value of the key.
     *
     * @returns {Number}
     */
  get length() {
    return this[P_LENGTH];
  }

  /**
     * Gets the used curve.
     *
     * @returns {Curve}
     */
  get curve() {
    return this[P_CURVE];
  }

  /**
     * Encodes a private key to a ByteCollection defined by PascalCoin.
     *
     * @returns {ByteCollection}
     */
  encode() {
    const curve = ByteCollection.fromInt(this.curve.id).switchEndian();
    const length = ByteCollection.fromInt(this.length, 2).switchEndian();

    return ByteCollection.concat(curve, length, this.key);
  }

  /**
     * Decodes a PascalCoin public key string.
     *
     * @param {ByteCollection} encoded
     * @returns {PublicKey}
     */
  static decode(encoded) {
    const curve = encoded.slice(0, 2).switchEndian().toInt();
    const length = encoded.slice(2, 4).switchEndian().toInt();
    const key = encoded.slice(4, 4 + length);

    return new PrivateKey(key, new Curve(curve));
  }

  /**
     * Encrypts the current key with the given password.
     *
     * @param {String} password
     * @returns {Buffer}
     */
  encrypt(password) {
    return new ByteCollection(
      AES.encrypt(this.encode().buffer, Buffer.from(password)),
    );
  }

  /**
     * Decrypts the given private key with the given password.
     *
   * @param {ByteCollection|String} encrypted
     * @param {String} password
     * @returns {Buffer}
     */
  static decrypt(encrypted, password) {
    // eslint-disable-next-line no-param-reassign
    encrypted = ByteCollection.fromHex(encrypted);
    const decrypted = AES.decrypt(encrypted.buffer, Buffer.from(password));

    if (decrypted === false) {
      return false;
    }

    return PrivateKey.decode(new ByteCollection(decrypted));
  }
}

module.exports = PrivateKey;
