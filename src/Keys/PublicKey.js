/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


const Hashing = require('./../Crypto/Hashing');
const BinToText = require('./../Crypto/BinToText');
const ByteCollection = require('./../ByteCollection');
const Curve = require('./Curve');

const P_X = Symbol('x');
const P_XL = Symbol('xl');
const P_Y = Symbol('y');
const P_YL = Symbol('yl');
const P_CURVE = Symbol('curve');

/**
 * Represents a public key in pascalcoin.
 */
class PublicKey {
  /**
     * Constructor
     *
     * @param {ByteCollection} x
     * @param {ByteCollection} y
     * @param {Curve} curve
     */
  constructor(x, y, curve) {
    this[P_X] = x;
    this[P_Y] = y;
    this[P_XL] = x.length;
    this[P_YL] = y.length;
    this[P_CURVE] = curve;
  }

  /**
     * Gets the X value of the key.
     *
     * @returns {ByteCollection}
     */
  get x() {
    return this[P_X];
  }

  /**
     * Gets the y value of the key.
     *
     * @returns {ByteCollection}
     */
  get y() {
    return this[P_Y];
  }

  /**
     * Gets the length of X.
     *
     * @returns {Number}
     */
  get yl() {
    return this[P_YL];
  }

  /**
     * Gets the length of Y.
     *
     * @returns {Number}
     */
  get xl() {
    return this[P_XL];
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
     * Encodes a public key to a ByteCollection defined by PascalCoin.
     *
     * @returns {ByteCollection}
     */
  encode() {
    const curve = ByteCollection.fromInt(this.curve.id, 2).switchEndian();
    const xl = ByteCollection.fromInt(this.xl, 2).switchEndian();
    const yl = ByteCollection.fromInt(this.yl, 2).switchEndian();
    return ByteCollection.concat(curve, xl, this.x, yl, this.y);
  }

  /**
     * Decodes an encoded public key.
     *
     * @param {ByteCollection|String} encoded
     * @returns {PublicKey}
     */
  static decode(encoded) {
    // eslint-disable-next-line no-param-reassign
    encoded = ByteCollection.fromHex(encoded);
    const curve = encoded.slice(0, 2).switchEndian().toInt();
    const xl = encoded.slice(2, 4).switchEndian().toInt();
    const x = encoded.slice(4, 4 + xl);
    const yl = encoded.slice(4 + xl, 6 + xl).switchEndian().toInt();
    const y = encoded.slice(6 + xl, 6 + xl + yl);
    return new PublicKey(x, y, new Curve(curve));
  }

  /**
     * Gets the base58 representation of a public key.
     *
     * @returns {String}
     */
  toBase58() {
    const prefix = ByteCollection.fromHex('01');
    const encoded = this.encode();
    const aux = new ByteCollection(Hashing.sha256(encoded.buffer));
    const suffix = aux.slice(0, 4);

    const raw = ByteCollection.concat(prefix, encoded, suffix);
    return BinToText.base58Encode(raw.buffer);
  }

  /**
     * Gets a public key instance from the given base58 string.
     *
     * @param {String} base58
     * @returns {PublicKey}
     */
  static fromBase58(base58) {
    const decoded = BinToText.base58Decode(base58);
    return PublicKey.decode(new ByteCollection(decoded.slice(1, -4)));
  }

  /**
     * Gets the ec key.
     *
     * @returns {ByteCollection}
     */
  get ec() {
    return ByteCollection.concat(this.x, this.y);
  }

  /**
     * Gets an empty public key instance.
     *
     * @returns {PublicKey}
     */
  static empty() {
    return new PublicKey(
      ByteCollection.fromString(''),
      ByteCollection.fromString(''),
      new Curve(0),
    );
  }
}

module.exports = PublicKey;
