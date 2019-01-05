const ByteCollection = require('./../ByteCollection');
const AES = require('./AES');

class Payload {
  static get METHOD_NONE() {
    return 'none';
  }

  static get METHOD_PWD() {
    return 'pwd';
  }

  static get METHOD_PUBKEY() {
    return 'publicKey';
  }

  /**
     *
     * @param {String} payload
     * @param {String} method
     * @param {String} password
     *
     * @return {ByteCollection}
     */
  static encrypt(payload, method = 'none', password = null) {
    const payloadBytes = ByteCollection.fromString(payload);

    switch (method) {
      default:
        return payloadBytes;
      case Payload.METHOD_NONE:
        return payloadBytes;
      case Payload.METHOD_PWD:
        return new ByteCollection(
          AES.encrypt(payloadBytes.buffer, ByteCollection.fromString(password).buffer),
        );
      case Payload.METHOD_PUBKEY:
        throw new Error('Public key Encryption/Decryption not implemented');
    }
  }

  static decrypt(encryptedPayload, password) {
    // eslint-disable-next-line no-param-reassign
    encryptedPayload = ByteCollection.fromHex(encryptedPayload);
    const viaPassword = AES.decrypt(
      encryptedPayload.buffer,
      ByteCollection.fromString(password).buffer,
    );

    if (viaPassword === false) {
      // TODO: use ecies
    }

    return viaPassword;
  }
}

module.exports = Payload;
