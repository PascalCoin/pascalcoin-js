const Elliptic = require('elliptic');
const Hashing = require('./Hashing');
const ByteCollection = require('./../ByteCollection');
const Curve = require('./../Keys/Curve');

// eslint-disable-next-line new-cap
const ec = new Elliptic.ec(Curve.SECP256K1);

class Signing {
  /**
     * Signs the given digest with the given keypair and returns the r and s
     * values (because thats all that is needed).
     *
     * @param {KeyPair} keyPair
     * @param {ByteCollection} digest
     */
  static sign(keyPair, digest) {
    const hash = new ByteCollection(Hashing.sha256(digest.buffer));
    const signature = ec.sign(hash.buffer, keyPair.ecPair.getPrivate('hex'), 'hex', {
      canonical: true
    });

    return {
      s: new ByteCollection(Buffer.from(signature.s.toArray())),
      r: new ByteCollection(Buffer.from(signature.r.toArray()))
    };
  }
}

module.exports = Signing;
