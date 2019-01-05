const eccrypto = require('eccrypto');
const elliptic = require('elliptic');

/**
 *
 */
class ECIES {
  static encrypt(data, publicKey) {
    return eccrypto.encrypt(publicKey, data, { iv: new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) });
  }

  static decrypt(data, keyPair) {
    const decrypted = eccrypto.decrypt(
      keyPair.getPrivate().toBuffer(), data,
    );
  }
}

module.exports = ECIES;
