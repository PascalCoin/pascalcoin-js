/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const forge = require('node-forge');
const Hashing = require('./Hashing');
const PublicKey = require('../Keys/PublicKey.js');
const AES = require('./AES');

/**
 * AES encryption / decryption for PascalCoin.
 */
class ECDA {
  /**
     * Encrypts the given data with the given password.
     *
     * @param {Buffer} data
     * @param {PublicKey} publicKey
     * @returns {Buffer}
     */
  static encrypt(data, publicKey) {

    let curve = publicKey.curve.ec;
    let tempKey = curve.genKeyPair();
    var pubkey = curve.keyFromPublic(publicKey.ec.buffer);
    let sharedSecret = tempKey.derive(pubkey.getPublic());
    let secrectkey = Hashing.sha512(sharedSecret.toArray());

    let encryptedData = AES.encrypt(data, secrectkey.slice(0, 32), new Buffer(16));

    return { data: encryptedData, publicKey: tempKey.getPublic(true, 'hex') };
  }
}

module.exports = AES;
