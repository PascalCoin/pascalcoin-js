/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const elliptic = require('elliptic');

const PrivateKey = require('./PrivateKey');
const Curve = require('./Curve');
const PublicKey = require('./PublicKey');
const ByteCollection = require('./../ByteCollection');

const P_PRIVATE_KEY = Symbol('private_key');
const P_PUBLIC_KEY = Symbol('public_key');
const P_CURVE = Symbol('curve');
const P_EC_PAIR = Symbol('ec_pair');

/**
 * Represents a private and public keypair.
 */
class KeyPair {
  /**
     * Creates a new private-public keypair instance.
     *
     * @param {PrivateKey} privateKey
     * @param {PublicKey} publicKey
     * @param {Object} ecPair
     */
  constructor(privateKey, publicKey, ecPair = null) {
    if (ecPair === null) {
      ecPair = elliptic.ec(privateKey.curve.name) // eslint-disable-line no-param-reassign
        .keyFromPrivate(privateKey.key.toHex(), 'hex');
    }

    this[P_CURVE] = privateKey.curve;
    this[P_PRIVATE_KEY] = privateKey;
    this[P_PUBLIC_KEY] = publicKey;
    this[P_EC_PAIR] = ecPair;
  }

  /**
     * Generates a new keypair from the given curve.
     *
     * @param {Curve} curve
     * @returns {KeyPair}
     */
  static generate(curve) {
    if (curve === undefined) {
      // eslint-disable-next-line no-param-reassign
      curve = Curve.getDefaultCurve();
    } else if (!(curve instanceof Curve)) {
      // eslint-disable-next-line no-param-reassign
      curve = new Curve(curve);
    }

    // TODO: entropy?
    // eslint-disable-next-line new-cap
    const kp = new elliptic.ec(curve.name).genKeyPair();
    const publicKey = new PublicKey(
      ByteCollection.fromHex(kp.getPublic().x.toString(16)),
      ByteCollection.fromHex(kp.getPublic().y.toString(16)),
      curve,
    );
    const privateKey = new PrivateKey(
      ByteCollection.fromHex(kp.getPrivate('hex')),
      curve,
    );

    return new KeyPair(privateKey, publicKey, kp);
  }

  /**
     * Gets the private key.
     *
     * @returns {PrivateKey}
     */
  get privateKey() {
    return this[P_PRIVATE_KEY];
  }

  /**
     * Gets the public key.
     *
     * @returns {PublicKey}
     */
  get publicKey() {
    return this[P_PUBLIC_KEY];
  }

  /**
     * Gets the curve used for the keypair.
     *
     * @returns {Curve}
     */
  get curve() {
    return this[P_CURVE];
  }

  /**
     * Gets the ec pair from the elliptic library.
     *
     * @returns {Object}
     */
  get ecPair() {
    return this[P_EC_PAIR];
  }

  /**
     * Creates a new keypair from the given private key.
     *
     * @param {PrivateKey} privateKey
     * @returns {KeyPair}
     */
  static fromPrivateKey(privateKey) {
    const ecPair = elliptic.ec(privateKey.curve.name).keyFromPrivate(privateKey.key.toHex(), 'hex');
    const publicKey = new PublicKey(
      ByteCollection.fromHex(ecPair.getPublic().x.toString(16)),
      ByteCollection.fromHex(ecPair.getPublic().y.toString(16)),
      privateKey.curve,
    );

    return new KeyPair(privateKey, publicKey, ecPair);
  }

  /**
     * Creates a new keypair from the given private key.
     *
     * @param {ByteCollection|String} encryptedPrivateKey
     * @param {String} password
     * @returns {KeyPair}
     */
  static fromEncryptedPrivateKey(encryptedPrivateKey, password) {
    // eslint-disable-next-line no-param-reassign
    encryptedPrivateKey = ByteCollection.fromHex(encryptedPrivateKey);
    const privateKey = PrivateKey.decrypt(encryptedPrivateKey, password);

    return KeyPair.fromPrivateKey(privateKey);
  }
}

module.exports = KeyPair;
