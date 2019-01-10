/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const forge = require('node-forge');
const Hashing = require('./Hashing');

/**
 * Gets the key for the cipher.
 *
 * @param {Buffer} password
 * @param {Buffer} salt
 * @returns {Buffer}
 */
function getKey(password, salt) {
  return Hashing.sha256(password, salt).slice(0, 32);
}

/**
 * Gets the IV for the cipher.
 *
 * @param {Buffer} key
 * @param {Buffer} password
 * @param {Buffer} salt
 * @returns {Buffer}
 */
function getIV(key, password, salt) {
  return Hashing.sha256(key, password, salt).slice(0, 16);
}

/**
 * AES encryption / decryption for PascalCoin.
 */
class AES {
  /**
   * Encrypts the given data with the given password.
   *
   * @param {Buffer} data
   * @param {Buffer} password
   * @returns {Buffer}
   */
  static encrypt(data, password) {
    const salt = Buffer.from(forge.random.getBytes(8), 'binary');
    const key = getKey(password, salt);
    const iv = getIV(key, password, salt);

    const cipher = forge.cipher.createCipher(
      'AES-CBC',
      forge.util.createBuffer(key.toString('binary')),
    );

    cipher.start({
      iv: forge.util.createBuffer(iv.toString('binary'))
    });
    cipher.update(forge.util.createBuffer(data.toString('binary')));
    cipher.finish();

    return Buffer.concat([Buffer.from('Salted__'), salt, Buffer.from(cipher.output.toHex(), 'hex')]);
  }

  /**
     * Decrypts the given encrypted data with the given password.
     *
     * @param {Buffer} data
     * @param {Buffer} password
     * @returns {Buffer|Boolean}
     */
  static decrypt(data, password) {
    // const magicSalted = data.slice(0, 8);
    const salt = data.slice(8, 16);
    const rest = data.slice(16);

    const key = getKey(password, salt);
    const iv = getIV(key, password, salt);

    const decipher = forge.cipher.createDecipher('AES-CBC', forge.util.createBuffer(key.toString('binary')));

    decipher.start({ iv: forge.util.createBuffer(iv.toString('binary')) });
    decipher.update(forge.util.createBuffer(rest.toString('binary')));
    if (!decipher.finish()) {
      return false;
    }

    return Buffer.from(decipher.output.toHex(), 'hex');
  }
}

module.exports = AES;
